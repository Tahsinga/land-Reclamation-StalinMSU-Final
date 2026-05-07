import json
import os
import sys
import urllib.request
import urllib.error

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
if not OPENAI_API_KEY:
    sys.stderr.write('OPENAI_API_KEY environment variable is required\n')
    sys.exit(1)

PROMPT_TEMPLATE = '''You are an expert mining geotechnical analyst. Analyze the following pillars and assign each pillar to exactly one category: good, fair, or bad.

Rules:
- Use only the categories good, fair, bad.
- Do not invent other categories.
- Base decisions on survey, geological, and geotechnical attributes.
- Return only a single JSON object, no markdown or extra text.
- The JSON object must contain these keys: analysis, good, fair, bad.
- analysis must map pillar ids to one of the three categories.

Example:
{
  "analysis": {"PillarA": "good", "PillarB": "bad"},
  "good": 1,
  "fair": 0,
  "bad": 1
}

Pillars data:
'''


def extract_json(text):
    text = text.strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Fallback: find first and last JSON braces and parse that
    start = text.find('{')
    end = text.rfind('}')
    if start == -1 or end == -1 or end <= start:
        raise ValueError('No valid JSON object found in response')

    candidate = text[start:end + 1].strip()
    # Remove markdown fences if present
    if candidate.startswith('```json'):
        candidate = candidate[len('```json'):].strip()
    if candidate.startswith('```') and candidate.endswith('```'):
        candidate = candidate[3:-3].strip()

    try:
        return json.loads(candidate)
    except json.JSONDecodeError as err:
        raise ValueError(f'JSON parse failed after cleanup: {err}. Candidate: {candidate}')


def build_prompt(pillars):
    data_json = json.dumps(pillars, separators=(',', ':'), ensure_ascii=False)
    return PROMPT_TEMPLATE + data_json


def call_openai(prompt):
    url = 'https://api.openai.com/v1/chat/completions'
    payload = {
        'model': 'gpt-4o-mini',
        'messages': [
            {'role': 'system', 'content': 'You are an expert mining geotechnical analyst.'},
            {'role': 'user', 'content': prompt}
        ],
        'temperature': 0.0,
        'max_tokens': 800,
        'top_p': 1.0
    }
    data = json.dumps(payload).encode('utf-8')
    request = urllib.request.Request(
        url,
        data=data,
        headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {OPENAI_API_KEY}'
        }
    )
    try:
        with urllib.request.urlopen(request, timeout=120) as response:
            body = response.read().decode('utf-8')
    except urllib.error.HTTPError as exc:
        body = exc.read().decode('utf-8')
        raise RuntimeError(f'OpenAI HTTP error {exc.code}: {body}')

    try:
        result = json.loads(body)
    except json.JSONDecodeError:
        raise RuntimeError(f'OpenAI returned invalid JSON: {body}')

    if 'error' in result:
        raise RuntimeError(f"OpenAI API error: {result['error'].get('message', 'unknown')}")

    choices = result.get('choices') or []
    if not choices:
        raise RuntimeError(f'OpenAI response missing choices: {body}')

    message = choices[0].get('message') or {}
    content = message.get('content')
    if not content:
        raise RuntimeError(f'OpenAI response missing message content: {body}')

    return content


def main():
    raw = sys.stdin.read()
    if not raw:
        sys.stderr.write('No input received\n')
        sys.exit(1)

    payload = json.loads(raw)
    pillars = payload.get('pillars') or []
    prompt = build_prompt(pillars)

    response_text = call_openai(prompt)

    try:
        result = extract_json(response_text)
    except Exception as parse_err:
        raise RuntimeError(f'Failed to parse assistant response: {parse_err}. Response text: {response_text}')

    if not isinstance(result, dict) or 'analysis' not in result:
        raise ValueError(f'OpenAI response did not contain analysis. Response text: {response_text}')

    sys.stdout.write(json.dumps(result))


if __name__ == '__main__':
    main()
