export const [Map, Zoom, Home, Locate, LayerList, OAuthInfo, identityManager, Portal] = await $arcgis.import([
  "@arcgis/core/Map.js",
  "@arcgis/core/widgets/Zoom.js",
  "@arcgis/core/widgets/Home.js",
  "@arcgis/core/widgets/Locate.js",
  "@arcgis/core/widgets/LayerList.js",
  "@arcgis/core/identity/OAuthInfo.js",
  "@arcgis/core/identity/IdentityManager.js",
  "@arcgis/core/portal/Portal.js",

]);

const info  = new OAuthInfo({
  appId: "Bpkw5HDSVTwuuddk",
  portalUrl: "https://pennstate.maps.arcgis.com",
  // popup: true,
});

const portal = new Portal({
  url: "https://pennstate.maps.arcgis.com",
  authMode: "immediate"
});

await portal.load();

console.log(portal.user);

identityManager.registerOAuthInfos([info]);

// Get a reference to the arcgis-layer-list element
const arcgisLayerList = document.querySelector("arcgis-layer-list");

// Set the listItemCreatedFunction to add a legend to each list item
arcgisLayerList.listItemCreatedFunction = (event) => {
  const { item } = event;
  if (item.layer.type !== "group") {
    item.panel = {
      content: "legend",
    };
  }
};

// Get a reference to the arcgis-map element
const viewElement = document.querySelector("arcgis-map");

// Wait for the map component to be ready before accessing its properties.
viewElement.addEventListener("arcgisViewReadyChange", async () => {

  const { portalItem } = viewElement.map;


    const navigationLogo = document.querySelector("calcite-navigation-logo");
  navigationLogo.heading = portalItem.title;
  navigationLogo.description = portalItem.snippet;
  navigationLogo.thumbnail = portalItem.thumbnailUrl;

  
   const activityLayer = viewElement.map.layers.find((layer) => layer.title === "ICE Report Form (Active)");
    const officeLayer = viewElement.map.layers.find((layer) => layer.title === "ICE Detention Centers/Field Offices");
  
  
    activityLayer.popupTemplate.title = "ICE activity reported at {address_or_nearest_address}";
   officeLayer.popupTemplate.expressionInfos = [{
    name: "displayName",
    expression: `
      if (IsEmpty($feature.Center_Name)) {
        return "Field Office: " + $feature.Office_Name;
      } else {
        return "Detention Center: " + $feature.Center_Name;
      }
    `
  }];
   officeLayer.popupTemplate.title = "{expression/displayName}";

    // viewElement.view.popup.dockEnabled = true;
    //   viewElement.view.popup.dockOptions = {
    //     buttonEnabled: false,
    //     breakpoint: false,
    //     position: "bottom-left",
    //   };
     
//    CODE ADAPTED FROM https://developers.arcgis.com/javascript/latest/sample-code/timeslider-component-filter/

      await viewElement.whenLayerView(activityLayer);

      const timeSlider = document.querySelector("arcgis-time-slider");

      const start = activityLayer.timeInfo.fullTimeExtent.start;
      start.setHours(0, 0, 0, 0);
      const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
    //   const end = new Date();
    //   end.setHours(23, 59, 59, 999);
      timeSlider.fullTimeExtent = { start:start, end:tomorrow };

      timeSlider.timeExtent = { start:start, end:tomorrow };

      timeSlider.stops = {
        interval: {
          value: 1,
          unit: "days",
        },
      };


//    const layerView = await viewElement.view.whenLayerView(activityLayer);

//   const timeSlider = document.querySelector("arcgis-time-slider");
   
//    // Use the actual timeInfo from the layer (set in ArcGIS Online)
//   timeSlider.fullTimeExtent = activityLayer.timeInfo.fullTimeExtent;
    
//     // timeSlider.stops = {
//     //   interval: {
//     //     value: 1,
//     //     unit: "days",
//     //   },
//     // };

//     // Set initial time extent to first day
//     const now = new Date();
//     const start = activityLayer.timeInfo.fullTimeExtent.start;
//     timeSlider.fullTimeExtent = { start:start, end:now };
//     timeSlider.timeExtent = { start:start, end:now };

//     // Listen to time slider changes
//     timeSlider.addEventListener("arcgisPropertyChange", async (event) => {
//       try {
//         const date = new Date(timeSlider.timeExtent.end)
//           .toISOString()
//           .replace("T", " ")
//           .replace("Z", "");

//         activityLayer.definitionExpression = `CreationDate <= Timestamp '${date}'`;

//         layerView.featureEffect = {
//           filter: {
//             timeExtent: timeSlider.timeExtent,
//             geometry: viewElement.view.extent,
//           },
//           excludedEffect: "grayscale(20%) opacity(12%)",
//         };
//       } catch (error) {
//         console.error(error);
//       }
//     });

});
