import geopandas as gpd

gdf = gpd.read_file(r'C:\Users\staline hove\Desktop\TABLES\Export_Output_5.shp')

print("Shape:", gdf.shape)
print("CRS:", gdf.crs)
print("Columns:", list(gdf.columns))

gdf.to_file(r'C:\Users\staline hove\Desktop\pillars.geojson', driver='GeoJSON')
print("Done!")