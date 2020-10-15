<template>
  <div class="app-container" :style="bgc">
    <div class="filter-container">
      <el-input v-model="listQuery.text" :placeholder="$t('widget.headerModel')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.source" :placeholder="$t('widget.headerSource')" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in widgetTemplateSourceOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.type" :placeholder="$t('widget.headerType')" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in widgetTemplateTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" style="margin-left: 10px;border-color: #1890ff;color: #1890ff;backgroundColor: rgb(240,242,245);" icon="el-icon-search" @click="handleFilter">
        {{ $t('widget.headerButtonSearch') }}
      </el-button>
      <el-button class="filter-item" style="float:right" type="primary" icon="el-icon-plus" @click="handleCreate">
        {{ $t('widget.headerButtonAdd') }}
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      style="width: 100%;"
      :empty-text="$t('widget.emptyRegisters')"
    >
      <el-table-column :label="$t('widget.listTitle')">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('widget.listDescription')">
        <template slot-scope="{row}">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('widget.listDate')" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createdAt | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('widget.listSource')" class-name="status-col">
        <template slot-scope="{row}">
          <el-tag size="mini" :color="getColorTag(row.source.substring(row.source.length - 4, row.source.length))" effect="light" class="el-tag-white">
            {{ row.source }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('widget.listType')" class-name="status-col">
        <template slot-scope="{row}">
          <el-tag size="mini" :color="getColorTag(row.type.substring(row.type.length - 4, row.type.length))" effect="light" class="el-tag-white">
            {{ row.type }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('widget.listStatus')" align="center">
        <template slot-scope="{row}">
          <el-switch
            :value="row.home && row.home.published"
            active-color="green"
            inactive-color="red"
            @change="handlePublishVisualization(row)"
          />
          <!--<el-tag v-if="row.home && row.home.published" size="mini" effect="dark" type="success">
            Public
          </el-tag>
          <el-tag v-else size="mini" effect="dark" type="danger">
            Hidden
          </el-tag>-->
        </template>
      </el-table-column>
      <el-table-column :label="$t('widget.listActions')" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <!--<el-button v-if="row.home" size="small" class="scheduleBtn" @click="handleModifyStatus(row,'unpublish')">
            {{ $t('widget.buttonDraft') }}
          </el-button>
          <el-button v-if="!row.home" size="small" class="scheduleBtn" @click="handleModifyStatus(row,'publish')">
            {{ $t('widget.buttonPublish') }}
          </el-button>
          <span style="padding-left:10px" />-->
          <el-button size="small" class="editBtn" @click="handleUpdate(row)">
            <i class="el-icon-edit">
              {{ $t('models.editModel') }}
            </i>
          </el-button>
          <span style="padding-left:10px" />
          <el-button size="small" class="deleteBtn" @click="handleModifyStatus(row,'deleted')">
            <i class="el-icon-delete-solid">
              {{ $t('models.deleteModel') }}
            </i>
          </el-button>
          <!--<el-row type="flex" class="row-bg" justify="center" :gutter="20">
            <el-col v-if="row.home" :span="6">
              <el-button size="small" type="info" @click="handleModifyStatus(row,'unpublish')">
                {{ $t('widget.buttonDraft') }}
              </el-button>
            </el-col>
            <el-col v-else :span="6">
              <el-button type="success" size="small" @click="handleModifyStatus(row,'publish')">
                {{ $t('widget.buttonPublish') }}
              </el-button>
            </el-col>
            <el-col :span="6">
              <el-button type="primary" size="small" @click="handleUpdate(row)">
                {{ $t('widget.buttonEdit') }}
              </el-button>
            </el-col>
            <el-col :span="6">
              <el-button type="danger" size="small" @click="handleModifyStatus(row,'deleted')">
                {{ $t('widget.buttonDelete') }}
              </el-button>
            </el-col>
          </el-row>-->
        </template>
      </el-table-column>
    </el-table>

    <!---<pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />-->

    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-container>
        <el-header height="100px">
          <el-steps :active="active" finish-status="success" :align-center="true" style="margin-top: 20px">
            <el-step :title="$t('widget.dialogSource')" />
            <el-step :title="$t('widget.dialogType')" />
            <el-step :title="$t('widget.dialogConfigure')" />
          </el-steps>
        </el-header>

        <el-main>
          <el-row v-if="active == 0">

            <el-col :span="24">
              <el-row :gutter="20">
                <el-col :span="8">
                  <div @click="selectSource = 'model-pas'">
                    <el-card :header="$t('widget.pasTitle')" :class="{'selected-card': selectSource == 'model-pas'}" shadow="hover" center>
                      {{ $t('widget.pasDescription') }}
                    </el-card>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div @click="selectSource = 'algorithm-pa'">
                    <el-card :header="$t('widget.paTitle')" :class="{'selected-card': selectSource == 'algorithm-pa'}" shadow="hover" center>
                      {{ $t('widget.paDescription') }}
                    </el-card>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div @click="selectSource = 'custom'">
                    <el-card :header="$t('widget.customTitle')" :class="{'selected-card': selectSource == 'custom'}" shadow="hover" center>
                      {{ $t('widget.customDescription') }}
                    </el-card>
                  </div>
                </el-col>
              </el-row>
            </el-col>

            <el-col :span="24">
              <el-row :gutter="20">
                <el-col :span="8">
                  <div @click="selectSource = 'real-time'">
                    <el-card :header="$t('widget.real-timeFromSensors')" :class="{'selected-card': selectSource == 'real-time'}" shadow="hover" center>
                      {{ $t('widget.realTimeDescription') }}
                    </el-card>
                  </div>
                </el-col>

                <el-col :span="8">
                  <div @click="selectSource = 'external-system'">
                    <el-card :header="$t('widget.realTimeExternalSystems')" :class="{'selected-card': selectSource == 'external-system'}" shadow="hover" center>
                      {{ $t('widget.real-timeFromExternalSystemsDescription') }}
                    </el-card>
                  </div>
                </el-col>

                <el-col :span="8">
                  <div @click="selectSource = 'noise-model'">
                    <el-card :header="$t('widget.noiseModel')" :class="{'selected-card': selectSource == 'noise-model'}" shadow="hover" center>
                      {{ $t('widget.noiseModelDescription') }}
                    </el-card>
                  </div>
                </el-col>

              </el-row>
            </el-col>

            <el-col :span="24">
              <el-row :gutter="20">

                <!--<el-col :span="8">
                  <div @click="selectSource = 'air-model'">
                    <el-card :header="$t('widget.airDispersionModel')" :class="{'selected-card': selectSource == 'air-model'}" shadow="hover" center>
                      {{ $t('widget.airDispersionModelDescription') }}
                    </el-card>
                  </div>
                </el-col>-->

                <el-col v-if="trafficIndex" :span="8">
                  <div @click="selectSource = 'traffic-model'">
                    <el-card :header="$t('widget.trafficModel')" :class="{'selected-card': selectSource == 'traffic-model'}" shadow="hover" center>
                      {{ $t('widget.trafficModelDescription') }}
                    </el-card>
                  </div>
                </el-col>

              </el-row>
            </el-col>

          </el-row>

          <el-row v-if="active == 1">

            <el-row v-if="selectSource == 'model-pas'" :gutter="20">
              <el-col :xs="24" :sm="12" :lg="8">
                <div @click="selectTypeWidget = 'gantt-bar-pas'">
                  <el-card header="Gantt PAS" shadow="always" :class="{'selected-card': selectTypeWidget == 'gantt-bar-pas'}">
                    <GanttBarPas style="height: 150px;" />
                  </el-card>
                </div>
              </el-col>
            </el-row>

            <el-row v-if="selectSource == 'algorithm-pa'" :gutter="20">
              <el-col :xs="24" :sm="12" :lg="8">
                <div @click="selectTypeWidget = 'gantt-bar-etd'">
                  <el-card header="Gantt PA" shadow="always" :class="{'selected-card': selectTypeWidget == 'gantt-bar-etd'}">
                    <GanttBarEtd style="height: 150px;" />
                  </el-card>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :lg="8">
                <div @click="selectTypeWidget = 'table-etd'">
                  <el-card header="Table" shadow="always" :class="{'selected-card': selectTypeWidget == 'table-etd'}">
                    <TableEtd style="height: 150px;" />
                  </el-card>
                </div>
              </el-col>
            </el-row>

            <el-row v-if="selectSource == 'custom'" :gutter="20">
              <el-col v-for="widget in widgetTemplateTypeOptions" :key="widget.key" :xs="24" :sm="12" :lg="8">
                <div @click="selectTypeWidget = widget.key">
                  <el-card :header="widget.key" shadow="always" :class="{'selected-card': selectTypeWidget == widget.key}">
                    <component :is="widget.key" style="height: 150px;" />
                  </el-card>
                </div>
              </el-col>
            </el-row>

            <el-row v-if="selectSource == 'real-time'" :gutter="20">
              <el-col :xs="24" :sm="12" :lg="8">
                <div @click="selectTypeWidget = 'table-sensors'">
                  <el-card header="Table" shadow="always" :class="{'selected-card': selectTypeWidget == 'table-sensors'}">
                    <TableSensors style="height: 150px;" />
                  </el-card>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :lg="8">
                <div @click="selectTypeWidget = 'echartBar-sensor'">
                  <el-card :header="$t('widget.barSimple')" shadow="always" :class="{'selected-card': selectTypeWidget == 'echartBar-sensor'}">
                    <EchartBarSensor style="height: 150px;" />
                  </el-card>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :lg="8">
                <div @click="selectTypeWidget = 'echartLine-sensor'">
                  <el-card :header="$t('widget.stepLine')" shadow="always" :class="{'selected-card': selectTypeWidget == 'echartLine-sensor'}">
                    <EchartLineSensor style="height: 150px;" />
                  </el-card>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :lg="8">
                <div @click="selectTypeWidget = 'map-sensor'">
                  <el-card :header="$t('widget.mapSensor')" shadow="always" :class="{'selected-card': selectTypeWidget == 'map-sensor'}">
                    <MapSensor style="height: 150px;" />
                  </el-card>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :lg="8">
                <div @click="selectTypeWidget = 'echartPie-sensor'">
                  <el-card :header="$t('widget.kpiPie')" shadow="always" :class="{'selected-card': selectTypeWidget == 'echartPie-sensor'}">
                    <EchartPieSensor style="height: 150px;" />
                  </el-card>
                </div>
              </el-col>
            </el-row>

            <el-row v-if="selectSource == 'external-system'" :gutter="20">
              <el-col :xs="24" :sm="12" :lg="8">
                <div @click="selectTypeWidget = 'table-external-system'">
                  <el-card header="Table" shadow="always" :class="{'selected-card': selectTypeWidget == 'table-external-system'}">
                    <TableExternalSystem style="height: 150px;" />
                  </el-card>
                </div>
              </el-col>
            </el-row>

            <el-row v-if="selectSource == 'air-model'" :gutter="20">
              <el-col :xs="24" :sm="12" :lg="8">
                <div @click="selectTypeWidget = 'map-dispersion'">
                  <el-card :header="$t('widget.geojsonMap')" shadow="always" :class="{'selected-card': selectTypeWidget == 'map-dispersion'}">
                    <MapDispersion style="height: 150px;" />
                  </el-card>
                </div>
              </el-col>
            </el-row>

            <el-row v-if="selectSource == 'noise-model'" :gutter="20">
              <el-col :xs="24" :sm="12" :lg="8">
                <div @click="selectTypeWidget = 'map-noise'">
                  <el-card :header="$t('widget.heatMap')" shadow="always" :class="{'selected-card': selectTypeWidget == 'map-noise'}">
                    <MapNoise style="height: 150px;" />
                  </el-card>
                </div>
              </el-col>
            </el-row>

            <el-row v-if="selectSource == 'traffic-model'" :gutter="20">
              <el-col :xs="24" :sm="12" :lg="8">
                <div @click="selectTypeWidget = 'table-traffic'">
                  <el-card header="Table" shadow="always" :class="{'selected-card': selectTypeWidget == 'table-traffic'}">
                    <TableTraffic style="height: 150px;" />
                  </el-card>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :lg="8">
                <div @click="selectTypeWidget = 'echartLine-traffic'">
                  <el-card :header="$t('widget.stepLine')" shadow="always" :class="{'selected-card': selectTypeWidget == 'echartLine-traffic'}">
                    <EchartLineTraffic style="height: 150px;" />
                  </el-card>
                </div>
              </el-col>
            </el-row>

          </el-row>

          <el-row v-if="active == 2">

            <el-row :gutter="20">
              <el-col :span="24">
                <el-form ref="dataForm" label-position="left" label-width="120px">
                  <el-form-builder v-if="selectTypeWidget" :model="formValues" :config="getFormTypeTemplate(selectTypeWidget, selectSource)" label-width="120px" @input="dataChanged" />
                </el-form>
              </el-col>
            </el-row>

            <el-row v-if="selectSource == 'model-pas'" :gutter="20">
              <el-col :span="24">
                <el-card>
                  <el-table
                    ref="multipleTable"
                    :data="tableData"
                    @selection-change="handleSelectionChange"
                  >
                    <el-table-column
                      type="selection"
                    />
                    <el-table-column
                      label="Fecha"
                    >
                      <template slot-scope="scope">{{ scope.row.date | parseTime('{y}-{m}-{d} {h}:{i}') }}</template>
                    </el-table-column>
                    <el-table-column
                      property="name"
                      label="Nombre"
                    />
                  </el-table>
                </el-card>
              </el-col>
            </el-row>

            <el-row v-if="selectSource == 'external-system'" :gutter="20">
              <el-col :span="24">
                <el-card>
                  <div v-if="externalSystems.length > 0">
                    <el-select v-model="typeSource" class="filter-item" :placeholder="$t('models.selectUnit')" filterable allow-create style="width:100%">
                      <el-option
                        v-for="item in externalSystems"
                        :key="item.sourceId"
                        :label="item.sourceId"
                        :value="item.sourceId"
                      />
                    </el-select>
                  </div>
                </el-card>
              </el-col>
            </el-row>

            <el-row v-if="selectSource == 'air-model'" :gutter="20">
              <el-col :span="24">
                <el-card>
                  <div v-if="executionsAirModel.length > 0">
                    <div v-if="selectTypeWidget == 'map-dispersion'">
                      <span style="color:red">
                        {{ $t('widget.selectMandatorySource') }}
                      </span>
                      <el-select v-model="idForAirDispersionModel" class="filter-item" :placeholder="$t('widget.selectExecution')" filterable allow-create style="width:100%">
                        <el-option
                          v-for="item in executionsAirModel"
                          :key="item.id"
                          :label="item.id"
                          :value="item.id"
                        />
                      </el-select>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>

            <el-row v-if="selectSource == 'traffic-model'" :gutter="20">
              <el-col :span="24">
                <el-card>
                  <div>
                    <span v-if="executionsTrafficModel.length > 0" style="color:red">
                      {{ $t('widget.selectMandatoryExecution') }}
                    </span>
                    <span v-else style="color:red">
                      {{ $t('widget.noExecutionAvailable') }}
                    </span>
                    <el-select v-model="idForTrafficModel" class="filter-item" :placeholder="$t('widget.selectExecution')" filterable allow-create style="width:100%">
                      <el-option
                        v-for="item in executionsTrafficModel"
                        :key="item.id"
                        :label="item.id"
                        :value="item.id"
                      />
                    </el-select>
                  </div>

                  <div v-if="selectTypeWidget !== 'table-traffic'">
                    <span style="color:red">
                      {{ $t('widget.selectMandatoryVisualizationType') }}
                    </span>
                    <el-select v-model="visualizationTypeForTrafficModel" class="filter-item" :placeholder="$t('widget.selectVisualizationType')" filterable allow-create style="width:100%">
                      <el-option
                        v-for="item in trafficVisualizations"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </div>
                </el-card>
              </el-col>
            </el-row>

            <el-row v-if="selectSource == 'real-time'" :gutter="20">
              <el-col :span="24">
                <el-card>
                  <div v-if="sensorsCollection.length > 0">
                    <div v-if="selectTypeWidget != 'map-sensor'">
                      <span style="color:red">
                        {{ $t('widget.selectMandatorySource') }}
                      </span>
                      <el-select v-model="typeSource" class="filter-item" :placeholder="$t('widget.selectSource')" filterable allow-create style="width:100%" @change="selectSourceId">
                        <el-option
                          v-for="item in sensorsCollection"
                          :key="item.sourceId"
                          :label="item.sourceId"
                          :value="item.sourceId"
                        />
                      </el-select>
                      <el-table ref="sensorsTable" :data="devices" @selection-change="handleChangedSensor">
                        <el-table-column type="selection" property="selected" />
                        <el-table-column :label="$t('widget.Name')">
                          <template slot-scope="scope">{{ scope.row.name }}</template>
                        </el-table-column>
                        <el-table-column :label="$t('widget.Longitude')">
                          <template slot-scope="scope">{{ scope.row.location.lon }}</template>
                        </el-table-column>
                        <el-table-column :label="$t('widget.Latitude')">
                          <template slot-scope="scope">{{ scope.row.location.lat }}</template>
                        </el-table-column>
                      </el-table>
                      <br>
                      <span style="color:red">
                        {{ $t('widget.validateSelectASensor') }}
                      </span>
                    </div>
                    <div v-else>
                      <span style="color:red">
                        {{ $t('widget.selectMandatorySourceForMapSensor') }}
                      </span>
                      <el-select v-model="typeSourceForMapSensor" class="filter-item" :placeholder="$t('widget.selectSource')" filterable allow-create style="width:100%" multiple @change="selectSourceForMap">
                        <el-option
                          v-for="item in sensorsCollection"
                          :key="item.sourceId"
                          :label="item.sourceId"
                          :value="item.sourceId"
                        />
                      </el-select>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>

            <!--<el-row v-show="selectSource == 'real-time'" :gutter="20">
              <el-col :span="24">
                <el-card>
                  <div v-if="sensorsCollection.length > 0">
                    <div v-for="(item,indexInput) in sensorsCollection" :key="indexInput">
                      <el-collapse v-model="activeInput" accordion @change="handleChangeInputSection">
                        <el-collapse-item :title="item.sourceId" :name="item.sourceId">
                          <el-table ref="sensorsTable" :data="item.sensors" @selection-change="handleChangedSensor">
                            <el-table-column type="selection" property="sensors.selected" />
                            <el-table-column :label="$t('widget.Name')">
                              <template slot-scope="scope">{{ scope.row.name }}</template>
                            </el-table-column>
                            <el-table-column :label="$t('widget.Longitude')">
                              <template slot-scope="scope">{{ scope.row.location.lon }}</template>
                            </el-table-column>
                            <el-table-column :label="$t('widget.Latitude')">
                              <template slot-scope="scope">{{ scope.row.location.lat }}</template>
                            </el-table-column>
                          </el-table>
                        </el-collapse-item>
                      </el-collapse>
                    </div>
                  </div>
                </el-card>
                <br>
                <span style="color:red">
                  {{ $t('widget.validateSelectASensor') }}
                </span>
              </el-col>
            </el-row>-->

          </el-row>
        </el-main>
      </el-container>

      <div slot="footer" class="dialog-footer">
        <el-button :disabled="active<1" @click="active--">
          {{ $t('widget.buttonPrevius') }}
        </el-button>
        <el-button v-if="active<2" type="primary" :disabled=" active == 0 && !selectSource || active == 1 && !selectTypeWidget" @click="active++">
          {{ $t('widget.buttonNext') }}
        </el-button>
        <el-button
          v-else
          type="primary"
          :disabled="(active == 2 && selectSource == 'model-pas' && !multipleSelection.length) || (active == 2 && selectSource == 'real-time' && selectTypeWidget !== 'map-sensor' && !multipleSensorSelected.length) || (active == 2 && selectSource == 'real-time' && selectTypeWidget === 'map-sensor' && !typeSourceForMapSensor.length) || (active == 2 && selectSource == 'air-model' && selectTypeWidget === 'map-dispersion' && !idForAirDispersionModel.length) || (active == 2 && selectSource == 'traffic-model' && (!idForTrafficModel || ( !visualizationTypeForTrafficModel && selectTypeWidget !== 'table-traffic')))"
          @click="dialogStatus==='create'?createData():updateData()"
        >
          {{ $t('widget.buttonDone') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { widgetFetchList, widgetCreate, widgetUpdate, widgetDelete } from '@/api/widget'
import { widgetTemplateFetchList } from '@/api/widget-template'
import waves from '@/directive/waves' // waves directive
// import { parseTime } from '@/utils'
import { getColor, unFlatten, flatten } from '@/utils/common'
// import Pagination from '@/components/Pagination' // secondary package based on el-pagination
// import { log } from 'util'
import EchartRadar from '@/components/widget/echart/EchartRadar'
import EchartPie from '@/components/widget/echart/EchartPie'
import EchartBar from '@/components/widget/echart/EchartBar'
import EchartBarSensor from '@/components/widget/echart/EchartBar_sensor'
import EchartLineSensor from '@/components/widget/echart/EchartLine_sensor'
import EchartLineTraffic from '@/components/widget/echart/EchartLine_traffic'
import EchartPieSensor from '@/components/widget/echart/EchartPie_sensor'
import CustomIframe from '@/components/widget/custom/CustomIframe'
import TableEtd from '@/components/widget/custom/TableEtd'
import TableSensors from '@/components/widget/custom/TableSensors'
import TableTraffic from '@/components/widget/custom/TableTraffic'
import TableExternalSystem from '@/components/widget/custom/TableExternalSystem'
import MapSensor from '@/components/widget/custom/Map'
import GanttBarEtd from '@/components/widget/echart/GanttBarEtd'
import GanttBarPas from '@/components/widget/echart/GanttBarPas'
import MapDispersion from '@/components/widget/custom/DispersionMap'
import MapNoise from '@/components/widget/custom/NoiseMap'
// import AirMap from '@/components/widget/custom/AirMap'

import { getModels, getInstancesByIdRef } from '@/api/otools'

import { getSourcesFromPort, ListSensorByIdSource } from '@/api/dataextractor_IH'

import { getIDFromAirDispersionModelExecution, getIDFromTrafficModelExecution, existIndex } from '@/api/PAS_IH' // lo encapsulo en este JS porque la requestURl es la que toca y para no crear otro JS solo con un metodo
import pixelConstants from '@/utils/constants' // import class for constants

export default {
  name: 'ComplexTable',
  components: {
    EchartRadar,
    EchartBar,
    EchartPie,
    CustomIframe,
    GanttBarEtd,
    GanttBarPas,
    TableEtd,
    TableSensors,
    TableTraffic,
    TableExternalSystem,
    EchartBarSensor,
    EchartLineSensor,
    EchartLineTraffic,
    EchartPieSensor,
    MapSensor,
    MapDispersion,
    MapNoise
  },
  directives: { waves },
  data() {
    return {
      active: 0,
      bgc: {
        backgroundColor: 'rgb(240,242,245)',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        position: 'absolute'
      },
      selectSource: null,
      selectTypeWidget: null,
      tableData: [],
      multipleSelection: [],
      multipleSensorSelected: [],
      formValues: null,
      formValuesDefinition: null,
      formConfig: null,
      widgetTemplateTypeOptions: null,
      widgetTemplateSourceOptions: null,
      tableKey: 0,
      list: null,
      listLoading: true,
      listQuery: {
        text: undefined,
        type: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      dialogTitle: '',
      sensorsCollection: [],
      originalStateSensors: [],
      externalSystems: [],
      executionsAirModel: [],
      executionsTrafficModel: [],
      activeInput: ['0'],
      typeSource: '',
      typeSourceForMapSensor: [],
      idForAirDispersionModel: '',
      idForTrafficModel: '',
      visualizationTypeForTrafficModel: '',
      devices: [],
      trafficVisualizations: pixelConstants.TYPE_OF_TRAFFIC_VISUALIZATION,
      trafficIndex: false
    }
  },
  created() {
    this.getList()
    this.getWidgetTemplate()
    this.getModels()
    this.getDifferentTypeOfSources()
    this.getExecutionsAirDispersionModel()
    this.getExecutionsTrafficModel()
    // console.log(this.sensorsCollection)
    this.existTraficIndex('trafficmodel')
  },
  methods: {
    existTraficIndex(indexName) {
      existIndex(indexName).then(response => {
        this.trafficIndex = true
        console.log('EXISTE')
      }).catch(err => {
        this.trafficIndex = false
        console.log('NO EXISTE')
      })
    },
    selectSourceForMap(value) {
      // console.log('Select source for map')
      // console.log(value)
      // console.log(value.length)
      this.typeSourceForMapSensor = value
    },
    selectSourceId(index) {
      console.log('Source choosen: ' + index)
      this.sensorsCollection.forEach(item => {
        if (item.sourceId === index) {
          this.devices = item.sensors
        }
      })
      console.log(this.devices)
    },
    handleChangeInputSection(val) {
      console.log('Cambio el estado del control que expande/colapsa')
      console.log(val)
    },
    initializeCollapseObject() {
      this.activeInput = ['0']
    },
    getExecutionsAirDispersionModel() {
      getIDFromAirDispersionModelExecution().then(response => {
        // console.log(response)
        response.hits.hits.forEach(item => {
          var itemObject = {
            'index': item._index,
            'type': item._type,
            'id': item._id
          }
          // console.log(item._id)
          this.executionsAirModel.push(itemObject)
        })
      })
    },
    getExecutionsTrafficModel() {
      getIDFromTrafficModelExecution().then(response => {
        // console.log(response)
        response.hits.hits.forEach(item => {
          var itemObject = {
            'index': item._index,
            'type': item._type,
            'id': item._id
          }
          // console.log(item._id)
          this.executionsTrafficModel.push(itemObject)
        })
        console.log('this.executionsTrafficModel = ', this.executionsTrafficModel)
      })
    },
    getDifferentTypeOfSources() {
      getSourcesFromPort().then(response => {
        console.log(response)
        response.forEach(obj => {
          if (obj.sourceTypeId.includes(pixelConstants.SENSOR)) {
            console.log('Es un sensor')
            var itemSensors = {
              'ID': obj.sourceTypeId,
              'sourceId': obj.sourceId,
              'sensors': []
            }
            ListSensorByIdSource(obj.sourceTypeId).then(response => {
              // console.log(response)
              var index = 0
              response.forEach(it => {
                var itemSensor = {
                  'name': it.data.name,
                  'location': it.data.location,
                  'dataProvider': it.data.dataProvider,
                  'observed': this.convertToDate(it.data.observed),
                  'timestamp': this.convertToDate(it.timestamp),
                  'index': index,
                  'selected': false
                }
                index = index + 1
                // sensores.push(itemSensor)
                itemSensors.sensors.push(itemSensor)
              })
            })
            this.sensorsCollection.push(itemSensors)
          } else {
            var externalSystem = {
              'indexName': obj.indexName,
              'sourceId': obj.sourceId,
              'sourceTypeId': obj.sourceTypeId
            }
            this.externalSystems.push(externalSystem)
          }
        })
        this.AddSensorToCollection()
        this.originalStateSensors = this.sensorsCollection// Almaceno la disposición original de los sensores
      })
    },
    AddSensorToCollection() {
      var itemSensors = {
        'ID': 'ID2',
        'sourceId': 'sourceTest',
        'sensors': []
      }
      var itemSensor = {
        'name': 'name1',
        'location': 45,
        'dataProvider': 'provider1',
        'observed': 25,
        'timestamp': 63,
        'index': 'index1',
        'selected': false
      }
      itemSensors.sensors.push(itemSensor)
      this.sensorsCollection.push(itemSensors)
    },
    convertToDate(timestamp) {
      var theDate = new Date(timestamp)
      return theDate
      // console.log(theDate)
    },
    getModels() {
      getModels().then(response => {
        console.log(response)
        response.forEach(data => {
          // if (data.category === 'energy') {
          if (data.generalInfo.category === 'energy') {
            this.getInstances(data.id)
          }
        })
        this.tableData.push({
          modelId: 'hard1',
          executionId: 'hard1',
          date: new Date(),
          name: 'Valid data'
        })
      })
    },
    getInstances(modelId) {
      getInstancesByIdRef({
        refId: modelId
      }).then(response => {
        response.forEach(element => {
          this.tableData.push({
            modelId: modelId,
            executionId: element.id,
            date: element.start,
            name: element.name
          })
        })
      })
    },
    handleChangedSensor(val) {
      this.multipleSensorSelected = []
      // this.multipleSelection = val
      val.forEach(element => {
        this.multipleSensorSelected.push({ name: element.name, index: element.index })
      })
    },
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = []
      // this.multipleSelection = val
      val.forEach(element => {
        this.multipleSelection.push({ modelId: element.modelId, executionId: element.executionId })
      })
    },
    dataChanged(data) {
      this.formValues = data
      console.log(this.formValues)
      // this.formValuesDefinition = data.definition
    },
    getList() {
      this.listLoading = true
      widgetFetchList(this.listQuery).then(response => {
        console.log(response.data)
        this.list = response.data
        this.total = response.data.length
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    getWidgetTemplate() {
      widgetTemplateFetchList().then(response => {
        this.formConfig = response.data
        this.widgetTemplateTypeOptions = this.formatTypeWidgetTemplate()
        this.widgetTemplateSourceOptions = this.formatSourceWidgetTemplate()
      })
    },

    formatTypeWidgetTemplate() {
      const data = []
      const tmpData = []
      for (var i = 0; i < this.formConfig.length; i++) {
        if (!tmpData.includes(this.formConfig[i].type)) {
          data.push({ key: this.formConfig[i].type, display_name: this.formConfig[i].type })
          tmpData.push(this.formConfig[i].type)
        }
      }
      return data
    },

    formatSourceWidgetTemplate() {
      const data = []
      const tmpData = []
      for (var i = 0; i < this.formConfig.length; i++) {
        if (!tmpData.includes(this.formConfig[i].source)) {
          data.push({ key: this.formConfig[i].source, display_name: this.formConfig[i].source })
          tmpData.push(this.formConfig[i].source)
        }
      }
      return data
    },

    handleFilter() {
      Object.keys(this.listQuery).forEach(key => {
        if (!this.listQuery[key]) {
          this.listQuery[key] = null
        }
      })
      this.getList()
    },
    handleModifyStatus(row, status) {
      switch (status) {
        case 'deleted':
          row.status = status
          this.handleDelete(row)
          break
        case 'publish':
          row.status = status
          this.handlePublish(row, true)
          break
        case 'unpublish':
          row.status = status
          this.handlePublish(row, false)
          break
      }
    },
    handlePublishVisualization(row) {
      const clicked = Object.assign({}, row)
      clicked.home = !clicked.home
      // row.home && row.home.published
      // const clicked = this.list.find(item => item._id === row._id)
      // clicked.subscribed = !clicked.subscribed
      if (clicked.home) {
        clicked.home = {
          published: true,
          position: [0, 0, 0, 0]
        }
      } else {
        clicked.home = null
      }
      widgetUpdate(clicked._id, clicked).then((data) => {
        var obj = this.list.find(x => x._id === data.data._id)
        Object.assign(obj, data.data)

        this.$notify({
          title: 'Success',
          message: 'Update Successfully',
          type: 'success',
          duration: 2000
        })
      }).catch(console.error)
    },
    handlePublish(row, publish) {
      const updated = Object.assign({}, row)

      if (publish) {
        updated.home = {
          published: true,
          position: [0, 0, 0, 0]
        }
      } else {
        updated.home = null
      }

      widgetUpdate(updated._id, updated).then((data) => {
        var obj = this.list.find(x => x._id === data.data._id)
        Object.assign(obj, data.data)

        this.$notify({
          title: 'Success',
          message: 'Update Successfully',
          type: 'success',
          duration: 2000
        })
      }).catch(console.error)
    },
    resetTemp() {
      this.active = 0
      this.selectSource = ''
      this.selectTypeWidget = ''
      this.multipleSelection = []
      this.multipleSensorSelected = []
      this.formValues = null
      // added by Nacho
      this.typeSource = ''
      this.visualizationTypeForTrafficModel = ''
      this.idForTrafficModel = ''
      this.typeSourceForMapSensor = []
      this.idForAirDispersionModel = ''
    },
    handleCreate() {
      console.log('ORIGINAL')
      console.log(this.originalStateSensors)
      this.resetTemp()
      this.sensorsCollection = this.originalStateSensors
      this.dialogStatus = 'create'
      this.dialogTitle = this.$t('widget.createVisualization')
      this.dialogFormVisible = true
    },
    createData() {
      var values = unFlatten(this.formValues)
      console.log('CREATE DATA')
      console.log(this.formValues)
      var error = false
      if (this.formValues.title) {
        values.source = this.selectSource
        values.type = this.selectTypeWidget

        if (values.source === 'model-pas') {
          values.filter = {}
          values.filter.id = this.multipleSelection
        }

        if (values.source === 'real-time' && values.type !== 'map-sensor') {
          values.filter = {}
          values.filter.id = this.multipleSensorSelected
          values.filter.start = this.formValues.filter$start
          values.filter.end = this.formValues.filter$end
          values.filter.source = this.typeSource
        }

        if (values.source === 'traffic-model') {
          values.filter = {}
          // Aquí hay que ver que le pasamos como idForTrafficModel: el que seleccione el usuario o siempre la última ejecución del modelo...
          values.filter.trafficType = this.visualizationTypeForTrafficModel
          values.filter.trafficId = this.idForTrafficModel
        }

        if (values.type === 'echartPie-sensor') {
          values.filter.wrongValue = this.formValues.wrongValue
        }

        if (values.source === 'external-system') {
          values.filter.sourceId = this.typeSource
        }

        if (values.type === 'map-sensor') {
          values.filter = {}
          values.filter.source = this.typeSourceForMapSensor
        }

        if (values.source === 'air-model' && values.type === 'map-dispersion') {
          values.filter = {}
          values.filter.source = this.idForAirDispersionModel
        }

        if (values.source === 'noise-model' && values.type === 'map-noise') {
          if (this.formValues.definition$url === null) {
            error = true
            this.$message({
              type: pixelConstants.WARNING_MESSAGE_TYPE,
              message: this.$t('widget.urlMandatory')
            })
          } else {
            values.filter = {}
            values.filter.source = this.formValues.definition$url
          }
        }

        if (!error) {
          console.log('values: ' + JSON.stringify(values))
          widgetCreate(values).then((data) => {
            this.dialogFormVisible = false
            this.resetTemp()
            this.list.push(data.data)
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          }).catch(console.error)
        }
      } else {
        this.$message({
          type: pixelConstants.WARNING_MESSAGE_TYPE,
          message: this.$t('widget.titleMandatory')
        })
      }
    },
    handleUpdate(row) {
      // console.log(row)
      // console.log(this.sensorsCollection)
      if (row.source === 'real-time') {
        this.sensorsCollection = this.originalStateSensors
        this.sensorsCollection.forEach(sensor => {
          sensor.sensors.forEach(element => {
            row.filter.id.forEach(item => {
              // console.log(element.name + '-' + item.name)
              if (element.name === item.name) {
                element.selected = true
              }
            })
          })
        })
      }
      console.log(this.sensorsCollection)
      this.active = 2
      this.selectSource = row.source
      this.selectTypeWidget = row.type
      this.formValues = flatten(Object.assign({}, row)) // copy obj
      this.dialogStatus = 'update'
      this.dialogTitle = this.$t('widget.updateVisualization')
      this.dialogFormVisible = true
    },
    updateData() {
      var values = unFlatten(this.formValues)
      values.source = this.selectSource
      values.type = this.selectTypeWidget

      if (values.source === 'model-pas') {
        values.filter = {}
        values.filter.id = this.multipleSelection
      }

      if (values.source === 'real-time') {
        values.filter = {}
        values.filter.id = this.multipleSensorSelected
        values.filter.start = this.formValues.filter$start
        values.filter.end = this.formValues.filter$end
        values.filter.source = this.typeSource
      }

      if (values.type === 'echartPie-sensor') {
        values.filter.wrongValue = this.formValues.wrongValue
      }

      if (values.source === 'external-system') {
        values.filter.sourceId = this.typeSource
      }

      widgetUpdate(values._id, values).then((data) => {
        this.dialogFormVisible = false
        this.resetTemp()

        var obj = this.list.find(x => x._id === data.data._id)
        Object.assign(obj, data.data)

        this.$notify({
          title: 'Success',
          message: 'Update Successfully',
          type: 'success',
          duration: 2000
        })
      }).catch(console.error)
    },
    handleDelete(row) {
      widgetDelete(row._id).then((data) => {
        this.dialogFormVisible = false
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
      }).catch(console.error)
    },
    getFormTypeTemplate(key, source) {
      for (var i = 0; i < this.formConfig.length; i++) {
        if (this.formConfig[i].type === key && this.formConfig[i].source === source) {
          return this.formConfig[i].template
        }
      }
    },
    getColorTag(color) {
      return getColor(color)
    }
  }
}
</script>

<style lang="scss" scoped>
.selected-card{
  border: 1px solid #0dea4c;
}
.el-tag-white {
  color: white;
}

.el-card{
  min-height: 150px;
}

.mark-red {
  background-color: #ff3d3d;
  color: black;
}

.mark-green {
  background-color: rgb(158, 255, 67);
  color: black;
}

.el-col {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }

  .scheduleBtn {
  color: #fff;
  background-color: #909399;
  border-color: #909399;
}
.editBtn {
  background-color: #e8f4ff;
  border-color: #d1e9ff;
  color: #1890ff;
}
.deleteBtn {
  color: #fff;
  background-color: #ff4949;
  border-color: #ff4949;
}
</style>
