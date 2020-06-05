export default {
  mapToModels: function(objModels) {
    var models = []
    for (var counter = 0; counter <= objModels.length - 1; counter++) {
      var addModel = {}
      addModel.value = objModels[counter].name
      addModel.author = objModels[counter].author
      addModel.category = objModels[counter].category
      addModel.cpu = objModels[counter].cpu
      addModel.creation = objModels[counter].creation
      addModel.description = objModels[counter].description
      addModel.id = objModels[counter].id
      addModel.inputDataSource_Description = objModels[counter].inputDatasources[0].description
      addModel.inputDataSource_Name = objModels[counter].inputDatasources[0].name
      addModel.inputDataSource_ServiceURL = objModels[counter].inputDatasources[0].serviceUrl
      addModel.inputFormat = objModels[counter].inputFormat
      addModel.licensing = objModels[counter].licensing
      addModel.name = objModels[counter].name
      addModel.outputFormat = objModels[counter].outputFormat
      // ports
      addModel.ram = objModels[counter].ram
      addModel.schedulable = objModels[counter].schedulable
      addModel.status = objModels[counter].status
      addModel.type = objModels[counter].type
      // addModel.urls_DashboardURL = objModels[counter].urls[0].dashboardUrl
      // addModel.urls_DockerImageURL = objModels[counter].urls[0].dockerImageUrl
      // addModel.urls_ServiceURL = objModels[counter].urls[0].serviceUrl
      models.push(addModel)
    }
    return models
  }, // end mapToModels
  mapToModel: function(objModels) {
    var models = []
    var addModel = {}
    addModel.value = objModels.name
    addModel.author = objModels.author
    addModel.category = objModels.category
    addModel.cpu = objModels.cpu
    addModel.creation = objModels.creation
    addModel.description = objModels.description
    addModel.id = objModels.id
    addModel.inputDataSource_Description = objModels.inputDatasources[0].description
    addModel.inputDataSource_Name = objModels.inputDatasources[0].name
    addModel.inputDataSource_ServiceURL = objModels.inputDatasources[0].serviceUrl
    addModel.inputFormat = objModels.inputFormat
    addModel.licensing = objModels.licensing
    addModel.name = objModels.name
    addModel.outputFormat = objModels.outputFormat
    // ports
    addModel.ram = objModels.ram
    addModel.schedulable = objModels.schedulable
    addModel.status = objModels.status
    addModel.type = objModels.type
    // addModel.urls_DashboardURL = objModels[counter].urls[0].dashboardUrl
    // addModel.urls_DockerImageURL = objModels[counter].urls[0].dockerImageUrl
    // addModel.urls_ServiceURL = objModels[counter].urls[0].serviceUrl
    models.push(addModel)
    return models
  } // end mapToModel
}
