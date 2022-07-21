Based on [this](https://developer.okta.com/blog/2022/03/14/react-vite-number-converter) great tutorial.
- `npm init vite@latest vite_react_leaflet -- --template react-ts`
- `npm install`
- check that the template runs: `npm run dev`

Changing the layout:
- `npm install @mui/material @emotion/react @emotion/styled`
- `npm install react react-dom leaflet react-leaflet`
- add leaflet's js and css to **index.html**:
```html
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.8.0/dist/leaflet.css"
    integrity="sha512-hoalWLoI8r4UszCkZ5kL8vayOGVae1oxXe/2A4AO6J9+580uKHDO3JdHb7NzwwzK5xr/Fs0W40kiNHxM9vyTtQ=="
    crossorigin=""/>
<script src="https://unpkg.com/leaflet@1.8.0/dist/leaflet.js"
   integrity="sha512-BB3hKbKWOc9Ez/TAwyWxNXeoV9c1v6FIeYiBieIWkpLjauysF18NzgR1MBNBXf8/KABdlkX68nAhlwcDFLGPCQ=="
   crossorigin=""></script>
```
- add `<div id='map'>` wrapping the MapContainer and set it's height in the css
- [here]() is a full repository code
<img width="943" alt="react_leaflet" src="https://user-images.githubusercontent.com/1709151/180208860-1e50397c-f322-44a7-96eb-f1ecf1e511e4.png">
