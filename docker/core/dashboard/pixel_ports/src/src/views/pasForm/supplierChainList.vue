<template>
  <div class="app-container" :style="bgc">
    <!-- BACK BUTTON -->
    <div class="filter-container">
      <el-link
        type="primary"
        icon="el-icon-arrow-left"
        @click="gotoListOfSuppierChain"
      >{{ $t("common.back") }}</el-link>
    </div>
    <!-- TABLE FOR DETAILS -->
    <div>
      <el-row class="SC-subheader">
        <span class="subTitle">{{ $t('supplierChain.detailsHeader') }}</span>
        <el-button class="filter-item" :disabled="listDetails.length > 0" style="float:right;" type="primary" icon="el-icon-plus" @click="addDetail">
          {{ $t('supplierChain.btnAddNewDetails') }}
        </el-button>
      </el-row>
      <el-row style="background:#fff;margin-bottom:30px;">
        <el-table
          v-loading="listLoading"
          :data="listDetails"
          border
          fit
          style="width: 100%;"
          :empty-text="$t('common.emptyTable')"
        >
          <el-table-column :label="$t('supplierChain.id')" align="center" :sortable="true" sort-by="id">
            <template slot-scope="{row}">
              <span>{{ row.idDetail }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('supplierChain.label')" align="center">
            <template slot-scope="{row}">
              <span>{{ row.label }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('supplierChain.comment')" align="center">
            <template slot-scope="{row}">
              <span>{{ row.comment }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('supplierChain.actions')" align="center" class-name="small-padding fixed-width">
            <template slot-scope="{row}">
              <!-- <el-button-group> -->
              <el-button size="small" class="editBtn" @click="editDetail(row)">
                <i class="el-icon-edit">
                  {{ $t('common.btnEdit') }}
                </i>
              </el-button>
              <span style="padding-left:10px" />
              <el-button size="small" class="deleteBtn" @click="deleteDetail(row)">
                <i class="el-icon-delete-solid">
                  {{ $t('common.btnDelete') }}
                </i>
              </el-button>
              <!-- </el-button-group> -->
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </div>
    <!-- TABLE FOR STEPS_LIST -->
    <div>
      <el-row class="SC-subheader">
        <span class="subTitle">{{ $t('supplierChain.stepsHeader') }}</span>
        <el-button class="filter-item" style="float:right;" type="primary" icon="el-icon-plus" @click="addStep">
          {{ $t('supplierChain.btnAddStep') }}
        </el-button>
      </el-row>
      <el-row style="background:#fff;margin-bottom:3px;">
        <el-table
          v-loading="listLoading"
          :data="supplierChainFilterByPagination"
          border
          fit
          style="width: 100%;"
          :empty-text="$t('common.emptyTable')"
        >
          <el-table-column :label="$t('supplierChain.id')" align="center" :sortable="true" sort-by="id">
            <template slot-scope="{row}">
              <span>{{ row.idStep }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('supplierChain.label')" align="center">
            <template slot-scope="{row}">
              <span>{{ row.label }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('supplierChain.comment')" align="center">
            <template slot-scope="{row}">
              <span>{{ row.comment }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('supplierChain.category')" align="center">
            <template slot-scope="{row}">
              <span>{{ row.category }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('supplierChain.actions')" align="center" class-name="small-padding fixed-width">
            <template slot-scope="{row}">
              <!-- <el-button-group> -->
              <el-button size="small" class="editBtn" @click="editStep(row)">
                <i class="el-icon-edit">
                  {{ $t('common.btnEdit') }}
                </i>
              </el-button>
              <span style="padding-left:10px" />
              <el-button size="small" class="deleteBtn" @click="deleteStep(row)">
                <i class="el-icon-delete-solid">
                  {{ $t('common.btnDelete') }}
                </i>
              </el-button>
              <!-- </el-button-group> -->
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <pagination v-show="stepsFilterBySearchTextLength>0" style="margin-bottom:20px;" :total="stepsFilterBySearchTextLength" :page.sync="listQueryStep.page" :limit.sync="listQueryStep.limit" @pagination="getListStepsBySC" />
    </div>
    <!-- TABLE FOR COMPATIBILITY -->
    <div>
      <el-row class="SC-subheader">
        <span class="subTitle">{{ $t('supplierChain.compatibilityHeader') }}</span>
        <el-button class="filter-item" :disabled="listCompatibility.length > 0" style="float:right;" type="primary" icon="el-icon-plus" @click="addCompatibility">
          {{ $t('supplierChain.btnAddNewCompatibility') }}
        </el-button>
      </el-row>
      <el-row style="background:#fff;margin-bottom:30px;">
        <el-table
          v-loading="listLoading"
          :data="listCompatibility"
          border
          fit
          style="width: 100%;"
          :empty-text="$t('common.emptyTable')"
        >
          <el-table-column :label="$t('supplierChain.cargoes_categoryHeader')" align="center" :sortable="true" sort-by="id">
            <template slot-scope="{row}">
              <el-tag v-for="(item, index) in row.cargoes_category" :key="index" style="margin-bottom:5px;margin-right:5px;" type="info">
                {{ index+1 }} - {{ item }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="$t('supplierChain.directions_NatureHeader')" align="center">
            <template slot-scope="{row}">
              <!--<span>{{ row.directions_Nature }}</span>-->
              <el-tag v-for="(item, index) in row.directions_Nature" :key="index" style="margin-bottom:5px;margin-right:5px;" type="info">
                {{ index+1 }} - {{ item }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="$t('supplierChain.areas_IDHeader')" align="center">
            <template slot-scope="{row}">
              <el-tag v-for="(item, index) in row.areas_ID" :key="index" style="margin-bottom:5px;margin-right:5px;" type="info">
                {{ index+1 }} - {{ item }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="$t('supplierChain.shiftworks_IDHeader')" align="center">
            <template slot-scope="{row}">
              <el-tag v-for="(item, index) in row.shiftworks_ID" :key="index" style="margin-bottom:5px;margin-right:5px;" type="info">
                {{ index+1 }} - {{ item }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="$t('supplierChain.actions')" align="center" class-name="small-padding fixed-width">
            <template slot-scope="{row}">
              <el-button size="small" class="editBtn" @click="editCompatibility(row)">
                <i class="el-icon-edit">
                  {{ $t('common.btnEdit') }}
                </i>
              </el-button>
              <span style="padding-left:10px" />
              <el-button size="small" class="deleteBtn" @click="deleteCompatibility(row)">
                <i class="el-icon-delete-solid">
                  {{ $t('common.btnDelete') }}
                </i>
              </el-button>
              <!-- </el-button-group> -->
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </div>
    <!-- DIALOG FOR DETAILS -->
    <div>
      <el-dialog
        :title="dialogTitleDetail"
        :visible.sync="dialogFormDetailVisible"
        width="60%"
        hide-overlay
        transition="dialog-bottom-transition"
        :before-close="handleCloseDialog"
      >
        <el-form
          ref="refDataFormDetail"
          :rules="rulesDetail"
          :model="dataFormDetail"
          :label-position="labelPosition"
          label-width="100px"
        >
          <el-form-item
            :label="$t('supplierChain.SupplierChainName_')"
            :label-width="labelWidth_long"
            :label-position="labelPosition"
            prop="idDetail"
          >
            <el-input ref="idDetail" v-model="dataFormDetail.idDetail" />
          </el-form-item>
          <el-form-item
            :label="$t('supplierChain.label_')"
            :label-width="labelWidth_long"
            :label-position="labelPosition"
          >
            <el-input v-model="dataFormDetail.label" />
          </el-form-item>
          <el-form-item
            :label="$t('supplierChain.comment_')"
            :label-width="labelWidth_long"
            :label-position="labelPosition"
          >
            <el-input v-model="dataFormDetail.comment" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="danger" @click="dialogFormDetailVisible = false">
            {{ $t('common.cancel') }}
          </el-button>
          <el-button type="success" @click="dialogTitleDetail===$t('supplierChain.createDetail')?createDetail('refDataFormDetail') : updateDetail()">
            {{ $t('common.confirm') }}
          </el-button>
        </div>
      </el-dialog>
    </div>
    <!-- DIALOG FOR STEPS_LIST -->
    <div>
      <el-dialog
        :title="dialogTitleStep"
        :visible.sync="dialogFormStepVisible"
        width="60%"
        hide-overlay
        transition="dialog-bottom-transition"
        :before-close="handleCloseDialog"
      >
        <el-form
          ref="refDataFormStep"
          :rules="rulesStep"
          :model="dataFormStep"
          :label-position="labelPosition"
          label-width="100px"
        >
          <el-container>
            <el-header height="100px">
              <el-steps
                :active="active"
                finish-status="success"
                :align-center="true"
                style="margin-top: 20px"
              >
                <el-step :title="$t('supplierChain.description')" />
                <el-step :title="$t('supplierChain.scheduling')" />
                <el-step :title="$t('supplierChain.work')" />
              </el-steps>
            </el-header>

            <el-main>
              <el-row v-if="active == 0">
                <el-col :span="24">
                  <el-form-item
                    :label="$t('supplierChain.idStep_')"
                    :label-width="labelWidth"
                    :label-position="labelPosition"
                    prop="idStep"
                  >
                    <!--<el-input v-model="dataFormStep.idStep" />-->
                    <el-input v-if="dialogTitleStep === $t('supplierChain.createStep')" v-model="dataFormStep.idStep" />
                    <el-input v-else v-model="dataFormStep.idStep" :disabled="true" />
                  </el-form-item>
                  <el-form-item
                    :label="$t('supplierChain.label_')"
                    :label-width="labelWidth"
                    :label-position="labelPosition"
                    prop="label"
                  >
                    <el-input v-model="dataFormStep.label" />
                  </el-form-item>
                  <el-form-item
                    :label="$t('supplierChain.comment_')"
                    :label-width="labelWidth"
                    :label-position="labelPosition"
                  >
                    <el-input v-model="dataFormStep.comment" />
                  </el-form-item>
                  <el-form-item
                    :label="$t('supplierChain.category_')"
                    :label-width="labelWidth"
                    :label-position="labelPosition"
                  >
                    <el-select v-model="dataFormStep.category" clearable class="filter-item" :placeholder="$t('supplierChain.selectCategory')" style="width:100%">
                      <el-option
                        v-for="item in stepCategory"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                    <!-- <el-input v-model="dataFormStep.category" /> -->
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if="active == 1" type="flex" justify="space-around">
                <el-col :span="10">
                  <el-card class="box-card" shadow="never">
                    {{ $t('supplierChain.start') }}
                    <el-divider />
                    <el-form
                      ref="refDataFormStart"
                      :rules="rulesStartAndDuration"
                      :model="dataFormStart"
                      :label-position="labelPosition"
                      label-width="100px"
                    >
                      <el-form-item
                        :label="$t('supplierChain.nature_')"
                        :label-width="labelWidth"
                        :label-position="labelPosition"
                        prop="nature"
                      >
                        <el-select v-model="dataFormStart.nature" clearable class="filter-item" :placeholder="$t('supplierChain.selectNature')" style="width:100%" @change="dataFormStart.value = null">
                          <el-option
                            v-for="item in startNature"
                            :key="item.value"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                      <el-form-item
                        v-if="dataFormStart.nature === 'delay'"
                        :label="$t('supplierChain.value_') + ' (minutes)'"
                        :label-width="labelWidth"
                        :label-position="labelPosition"
                        prop="value"
                      >
                        <el-input-number v-model.number="dataFormStart.value" :min="0" style="width:100%" />
                      </el-form-item>
                      <el-form-item
                        v-else
                        :label="$t('supplierChain.value_')"
                        :label-width="labelWidth"
                        :label-position="labelPosition"
                        prop="value"
                      >
                        <el-select v-model="dataFormStart.value" clearable multiple filterable allow-create class="filter-item" :placeholder="$t('supplierChain.selectSteps')" style="width:100%">
                          <el-option
                            v-for="item in listStepsName"
                            :key="item.value"
                            :value="item.value"
                          />
                        </el-select>
                        <!-- <el-input v-model="dataFormStart.value" placeholder="ARRAY of available STEPS" /> -->
                      </el-form-item>
                    </el-form>
                  </el-card>
                </el-col>
                <el-col :span="10">
                  <el-card class="box-card" shadow="never">
                    {{ $t('supplierChain.duration') }}
                    <el-divider />
                    <el-form
                      ref="refDataFormDuration"
                      :rules="rulesStartAndDuration"
                      :model="dataFormDuration"
                      :label-position="labelPosition"
                      label-width="100px"
                    >
                      <el-form-item
                        :label="$t('supplierChain.nature_')"
                        :label-width="labelWidth"
                        :label-position="labelPosition"
                        prop="nature"
                      >
                        <el-select v-model="dataFormDuration.nature" clearable class="filter-item" :placeholder="$t('supplierChain.selectNature')" style="width:100%" @change="dataFormDuration.value = null">
                          <el-option
                            v-for="item in durationNature"
                            :key="item.value"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                      <el-form-item
                        v-if="dataFormDuration.nature === 'delay'"
                        :label="$t('supplierChain.value_') + ' (minutes)'"
                        :label-width="labelWidth"
                        :label-position="labelPosition"
                        prop="value"
                      >
                        <el-input-number v-model.number="dataFormDuration.value" :min="0" style="width:100%" />
                      </el-form-item>
                      <el-form-item
                        v-else-if="dataFormDuration.nature === 'cargo_tons'"
                        :label="$t('supplierChain.value_') + ' (Tons)'"
                        :label-width="labelWidth"
                        :label-position="labelPosition"
                        prop="value"
                      >
                        <el-input-number v-model.number="dataFormDuration.value" :min="0" style="width:100%" />
                      </el-form-item>
                      <el-form-item
                        v-else-if="dataFormDuration.nature === 'cargo_%'"
                        :label="$t('supplierChain.value_') + ' (%)'"
                        :label-width="labelWidth"
                        :label-position="labelPosition"
                        prop="value"
                      >
                        <el-input-number v-model.number="dataFormDuration.value" :min="0" :max="100" style="width:100%" />
                      </el-form-item>
                      <el-form-item
                        v-else
                        :label="$t('supplierChain.value_')"
                        :label-width="labelWidth"
                        :label-position="labelPosition"
                        prop="value"
                      >
                        <el-select v-model="dataFormDuration.value" clearable multiple filterable allow-create class="filter-item" :placeholder="$t('supplierChain.selectSteps')" style="width:100%">
                          <el-option
                            v-for="item in listStepsName"
                            :key="item.value"
                            :value="item.value"
                          />
                        </el-select>
                        <!-- <el-input v-model="dataFormDuration.value" placeholder="ARRAY of available STEPS" /> -->
                      </el-form-item>
                    </el-form>
                  </el-card>
                </el-col>
              </el-row>
              <el-row v-if="active == 2">
                <el-col :span="24">
                  <el-form
                    ref="refDataFormWork"
                    :rules="rulesWork"
                    :model="dataFormWork"
                    :label-position="labelPosition"
                    label-width="100px"
                  >

                    <el-form-item
                      :label="$t('supplierChain.nature_')"
                      :label-width="labelWidth"
                      :label-position="labelPosition"
                      prop="nature"
                    >
                      <el-select v-model="dataFormWork.nature" clearable class="filter-item" :placeholder="$t('supplierChain.selectNature')" style="width:100%">
                        <el-option
                          v-for="item in workNature"
                          :key="item.value"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item
                      :label="$t('supplierChain.distance_')"
                      :label-width="labelWidth"
                      :label-position="labelPosition"
                    >
                      <el-input v-model="dataFormWork.distance" />
                    </el-form-item>
                    <el-form-item
                      :label="$t('supplierChain.machines_')"
                      :label-width="labelWidth"
                      :label-position="labelPosition"
                      prop="machines"
                    >
                      <el-select v-model="dataFormWork.machines" clearable multiple class="filter-item" :placeholder="$t('supplierChain.selectMachines')" style="width:100%">
                        <el-option
                          v-for="item in machinesList"
                          :key="item.idMachine"
                          :value="item.idMachine"
                          multiple
                        />
                      </el-select>
                    </el-form-item>
                  </el-form>

                </el-col>
              </el-row>
            </el-main>

          </el-container>
        </el-form>
        <el-row>
          <el-button style="float:left;" :disabled="active < 1" @click="active--">
            {{ $t("widget.buttonPrevius") }}
          </el-button>
          <el-button
            v-if="active < 2"
            style="float:right;"
            type="primary"
            @click="validateStep()"
          >
            {{ $t("widget.buttonNext") }}
          </el-button>
          <el-button
            v-else
            type="success"
            style="float:right;"
            @click="
              dialogTitleStep === $t('supplierChain.createStep')
                ? preValidateNameStep('refDataFormStep')
                : updateStep()
            "
          >
            {{ $t('common.confirm') }}
          </el-button>
        </el-row>
      </el-dialog>
    </div>
    <!-- DIALOG FOR COMPATIBILITY -->
    <div>
      <el-dialog :title="dialogTitleCompatibility" :visible.sync="dialogFormCompatibilityVisible" width="60%" hide-overlay transition="dialog-bottom-transition" :before-close="handleCloseDialog">
        <el-form ref="refDataFormCompatibility" :model="dataFormCompatibility" :label-position="labelPosition" label-width="100px">
          <el-form-item :label="$t('supplierChain.cargoes_category')" :label-width="labelWidthCompatibility" :label-position="labelPosition">
            <el-select v-model="dataFormCompatibility.cargoes_category" clearable multiple class="filter-item" :placeholder="$t('supplierChain.selectCargoesCategory')" style="width:100%">
              <el-option
                v-for="item in cargoCategoryList"
                :key="item.idCargoCategory"
                :label="item.idCargoCategory"
                :value="item.idCargoCategory"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('supplierChain.directions_Nature')"
            :label-width="labelWidthCompatibility"
            :label-position="labelPosition"
          >
            <el-select v-model="dataFormCompatibility.directions_Nature" clearable multiple class="filter-item" :placeholder="$t('supplierChain.selectdirections_Nature')" style="width:100%">
              <el-option
                v-for="item in directionsNature"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('supplierChain.areas_ID')"
            :label-width="labelWidthCompatibility"
            :label-position="labelPosition"
          >
            <el-select v-model="dataFormCompatibility.areas_ID" clearable multiple class="filter-item" :placeholder="$t('supplierChain.selectAreas_ID')" style="width:100%">
              <el-option
                v-for="item in areaList"
                :key="item.idArea"
                :label="item.idArea"
                :value="item.idArea"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('supplierChain.shiftworks_ID')"
            :label-width="labelWidthCompatibility"
            :label-position="labelPosition"
          >
            <!-- <el-input v-model="dataFormCompatibility.cargoes_category" /> -->
            <el-select v-model="dataFormCompatibility.shiftworks_ID" clearable multiple class="filter-item" :placeholder="$t('supplierChain.selectShifworks_ID')" style="width:100%">
              <el-option
                v-for="item in shiftWorkList"
                :key="item.idShiftWork"
                :label="item.idShiftWork"
                :value="item.idShiftWork"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="danger" @click="dialogFormCompatibilityVisible = false">
            {{ $t('common.cancel') }}
          </el-button>
          <el-button type="success" @click="dialogTitleCompatibility===$t('supplierChain.createCompatibility')?createCompatibility('refDataFormCompatibility') : updateCompatibility()">
            {{ $t('common.confirm') }}
          </el-button>
        </div>
      </el-dialog>
    </div>
    <div class="filter-container">
      <el-link
        type="primary"
        icon="el-icon-arrow-left"
        @click="gotoListOfSuppierChain"
      >{{ $t("common.back") }}</el-link>
    </div>

  </div>
</template>

<script>
import { stepFetchList, stepFilterBySC, stepCreate, stepDelete, stepUpdate } from '@/api/step'
import { detailFilterBySC, detailCreate, detailDelete, detailUpdate } from '@/api/detail'
import { compatibilityFilterBySC, compatibilityCreate, compatibilityDelete, compatibilityUpdate } from '@/api/compatibility'
import { supplierChainUpdate, supplierChainGet } from '@/api/supplierChain'
import { shiftWorkFetchList } from '@/api/shiftWork'
import { areaFetchList } from '@/api/area'
import { cargoCategoryFetchList } from '@/api/cargoCategory'
import pixelConstants from '@/utils/constants' // import class for constants
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import { machineFetchList } from '@/api/machine'
import directions_Nature from './files/directions_nature.json'
import step_category from './files/step_category.json'
export default {
  name: 'SupplierChainList',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      bgc: {
        backgroundColor: 'rgb(240,242,245)',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        position: 'absolute'
      },
      // category: [
      //   { value: 'Initialization' },
      //   { value: 'Processing' },
      //   { value: 'Support' },
      //   { value: 'Discontinuous' }
      // ],
      startNature: [
        { value: 'delay' },
        { value: 'with_any' },
        { value: 'with_all' },
        { value: 'after_any' },
        { value: 'after_all' }
      ],
      durationNature: [
        { value: 'delay' },
        { value: 'cargo_tons' },
        { value: 'cargo_%' },
        { value: 'before_any' },
        { value: 'before_all' },
        { value: 'after_any' },
        { value: 'after_all' }
      ],
      workNature: [
        { value: 'parallel' },
        { value: 'sequential' }
      ],
      active: 0,
      dialogFormDetailVisible: false,
      dialogTitleDetail: '',
      dialogFormStepVisible: false,
      dialogTitleStep: '',
      dialogFormCompatibilityVisible: false,
      dialogTitleCompatibility: '',
      listLoading: true,
      listSteps: [],
      listDetails: [],
      listCompatibility: [],
      machinesList: [],
      shiftWorkList: [],
      cargoCategoryList: [],
      areaList: [],
      totalSteps: 0,
      labelPosition: 'left',
      // labelColumn: '110px',
      labelWidthCompatibility: '150px',
      labelWidth: '130px',
      labelWidth_long: '160px',
      listQueryStep: {
        page: 1,
        limit: 5,
        text: undefined,
        type: undefined,
        idStep: undefined
      },
      dataFormStep: {
        idSC: null,
        idStep: '',
        label: '',
        comment: '',
        category: '',
        scheduling: {
          start: null,
          duration: null
        },
        work: {}
      },
      dataFormStart: {
        nature: '',
        value: null
      },
      dataFormDuration: {
        nature: '',
        value: null
      },
      dataFormWork: {
        nature: '',
        distance: '',
        machines: null
      },
      dataFormDetail: {
        idDetail: '',
        label: '',
        comment: ''
      },
      dataFormCompatibility: {
        cargoes_category: [],
        directions_Nature: [],
        areas_ID: [],
        shiftworks_ID: []
      },
      rulesStep: {
        idStep: [
          {
            required: true,
            message: this.$t('supplierChain.errStepIDRequired'),
            trigger: 'blur'
          }
        ],
        label: [
          {
            required: true,
            message: this.$t('supplierChain.errStepLabelRequired'),
            trigger: 'blur'
          }
        ]
      },
      rulesStartAndDuration: {
        nature: [
          {
            required: true,
            message: this.$t('supplierChain.errStepNatureRequired'),
            trigger: 'blur'
          }
        ],
        value: [
          {
            required: true,
            message: this.$t('supplierChain.errStepValueRequired'),
            trigger: 'blur'
          }
        ]
      },
      rulesWork: {
        nature: [
          {
            required: true,
            message: this.$t('supplierChain.errStepNatureRequired'),
            trigger: 'blur'
          }
        ],
        machines: [
          {
            required: true,
            message: this.$t('supplierChain.errStepMachinesRequired'),
            trigger: 'blur'
          }
        ]
      },
      rulesDetail: {
        idDetail: [
          {
            required: true,
            message: this.$t('supplierChain.errSC_NameRequired'),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    stepCategory() {
      return step_category
    },
    directionsNature() {
      console.log('Hola directions nature')
      console.log(directions_Nature)
      return directions_Nature
    },
    listStepsName() {
      const listStepsWithoutSelf = this.listSteps.filter(item => item.idStep !== this.dataFormStep.idStep)
      const listStepsName = listStepsWithoutSelf.map(item => {
        return { value: item.idStep }
      })
      return listStepsName
    },
    stepsFilterBySearchText() {
      return this.listSteps
    },
    stepsFilterBySearchTextLength() {
      return this.stepsFilterBySearchText.length
    },
    supplierChainFilterByPagination() {
      const page = this.listQueryStep.page
      const limit = this.listQueryStep.limit

      if (Math.ceil(this.stepsFilterBySearchTextLength / limit) >= page) {
        return this.stepsFilterBySearchText.slice((page - 1) * limit, page * limit)
      } else {
        return this.stepsFilterBySearchText.slice(0, limit)
      }
    },
    idSC() {
      console.log(this.$route.params.id)
      return this.$route.params.id
    }
  },
  created() {
    this.getListStepsBySC()
    this.getListDetailsBySC()
    this.getListCompatibilityBySC()
    this.recoverMachines()
    this.recoverShiftWork()
    this.recoverAreas()
    this.recoverCargoCategories()
  },
  methods: {
    recoverShiftWork() {
      shiftWorkFetchList(this.listQuery).then(response => {
        this.shiftWorkList = response.data
        console.log('ShiftWork')
        console.log(this.shiftWorkList)
      }).catch(err => {
        console.error(err)
      })
    },
    recoverAreas() {
      areaFetchList(this.listQuery).then(response => {
        this.areaList = response.data
        console.log('Areas')
        console.log(this.areaList)
      }).catch(err => {
        console.error(err)
      })
    },
    recoverCargoCategories() {
      cargoCategoryFetchList(this.listQuery).then(response => {
        this.cargoCategoryList = response.data
        console.log('CargoCategories')
        console.log(this.cargoCategoryList)
      }).catch(err => {
        console.error(err)
      })
    },
    gotoListOfSuppierChain() {
      this.$router.push({ name: 'Supplier Chain' })
      // this.$router.push({ name: 'generic dashboard', params: { id: row._id }})
    },
    recoverMachines() {
      machineFetchList(this.listQuery).then(response => {
        this.machinesList = response.data
        // console.log(this.machinesList)
      }).catch(err => {
        console.error(err)
      })
    },
    handleCloseDialog(done) {
      this.$confirm(this.$t('common.closeDialog'), this.$t('common.warning'), {
        confirmButtonText: this.$t('common.ok'),
        cancelButtonText: this.$t('common.cancel'),
        type: pixelConstants.WARNING_MESSAGE_TYPE
      })
        .then(_ => {
          done()
          this.active = 0
        })
        .catch(_ => {})
    },
    validateStep() {
      if (this.active === 0) {
        return new Promise((resolve, reject) => {
          this.$refs.refDataFormStep.validate((valid) => {
            if (valid) {
              this.active++
            }
          })
        })
      } else {
        return new Promise((resolve, reject) => {
          this.$refs.refDataFormStart.validate((valid) => {
            if (valid) {
              return new Promise((resolve, reject) => {
                this.$refs.refDataFormDuration.validate((valid2) => {
                  if (valid2) {
                    this.active++
                  }
                })
              })
            }
          })
        })
      }
    },
    getListStepsBySC() {
      this.listLoading = true
      stepFilterBySC(this.idSC).then(response => {
        console.log('STEPS DE MONGODB')
        console.log(response.data)
        this.listSteps = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      }).catch(err => { console.error(err) })
    },
    getListDetailsBySC() {
      this.listLoading = true
      detailFilterBySC(this.idSC).then(response => {
        console.log('DETAILS DE MONGODB')
        console.log(response.data)
        this.listDetails = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      }).catch(err => { console.error(err) })
    },
    getListCompatibilityBySC() {
      this.listLoading = true
      compatibilityFilterBySC(this.idSC).then(response => {
        console.log('COMPATIBILITY DE MONGODB')
        console.log(response.data)
        this.listCompatibility = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      }).catch(err => { console.error(err) })
    },
    handleClose(done) {
      this.$confirm(this.$t('common.closeDialog'), this.$t('common.warning'), {
        confirmButtonText: this.$t('common.ok'),
        cancelButtonText: this.$t('common.cancel'),
        type: pixelConstants.WARNING_MESSAGE_TYPE
      })
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    deleteDetail(row) {
      this.$confirm(this.$t('common.removeDetail'), this.$t('common.deleteDetail'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: pixelConstants.WARNING_MESSAGE_TYPE
      }).then(async() => {
        await detailDelete(row._id)
        this.getListDetailsBySC()
        this.updateSC_Item()
        this.$message({
          type: pixelConstants.SUCCESS_MESSAGE_TYPE,
          message: this.$t('common.deleteSucced')
        })
      }).catch(err => { console.error(err) })
    },
    deleteStep(stepRow) {
      const idStep = stepRow.idStep
      console.log('idStep: ', idStep)
      let stepToDelete = true
      const relatingSteps = []
      /* const startValue = stepRow.scheduling.start.value
      const durationValue = stepRow.scheduling.duration.value
      if (Array.isArray(startValue) && Array.isArray(durationValue)) {
        relatingSteps = [...startValue, durationValue]
      } else if (Array.isArray(startValue)) {
        relatingSteps = startValue
      } else if (Array.isArray(durationValue)) {
        relatingSteps = durationValue
      }*/
      console.log(relatingSteps)

      this.listSteps.forEach(step => {
        if (step.idStep !== idStep) {
          if (step.scheduling.duration.value[0] === idStep || step.scheduling.start.value[0] === idStep) {
            stepToDelete = false
            // Mensaje para decir que no se puede borrar
            /* this.$message({
              type: pixelConstants.ERROR_MESSAGE_TYPE,
              message: this.$t('common.StepNoDelete') + step.idStep + this.$t('common.stepRelatedForPropertyDuration')
            })*/
          }
        }
      })
      console.log('relatingSteps: ', relatingSteps)
      /* this.listSteps.forEach(step => {
        if (relatingSteps.some(item => item === step.idStep)) {
          stepToDelete = false
        }
      })*/
      if (stepToDelete) {
        this.$confirm(this.$t('common.removeStep'), this.$t('common.deleteStep'), {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: pixelConstants.WARNING_MESSAGE_TYPE
        }).then(async() => {
          await stepDelete(stepRow._id)
          this.getListStepsBySC()
          this.updateSC_Item()
          this.$message({
            type: pixelConstants.SUCCESS_MESSAGE_TYPE,
            message: this.$t('common.deleteSucced')
          })
        }).catch(err => { console.error(err) })
      } else {
        this.$message({
          type: pixelConstants.ERROR_MESSAGE_TYPE,
          message: this.$t('common.stepRelatedToStep')
        })
      }
    },
    deleteCompatibility(row) {
      this.$confirm(this.$t('common.removeDetail'), this.$t('common.deleteDetail'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: pixelConstants.WARNING_MESSAGE_TYPE
      }).then(async() => {
        await compatibilityDelete(row._id)
        this.getListCompatibilityBySC()
        this.updateSC_Item()
        this.$message({
          type: pixelConstants.SUCCESS_MESSAGE_TYPE,
          message: this.$t('common.deleteSucced')
        })
      }).catch(err => { console.error(err) })
    },
    editDetail(row) {
      this.dialogTitleDetail = this.$t('supplierChain.editDetail')
      console.log(row)
      // this.dataFormDetail = [...row]
      this.dataFormDetail = JSON.parse(JSON.stringify(row))
      this.dialogFormDetailVisible = true
      this.$nextTick(() => {
        this.$refs['refDataFormDetail'].clearValidate()
      })
    },
    editStep(row) {
      this.dialogTitleStep = this.$t('supplierChain.editStep')
      console.log(row)
      // deep copy of "row" into "dataFormStep"
      this.dataFormStep = JSON.parse(JSON.stringify(row))
      // deep copy of "row.scheduling.start" into "dataFormStart"
      this.dataFormStart = JSON.parse(JSON.stringify(row.scheduling.start))
      // deep copy of "row.scheduling.duration" into "dataFormDuration"
      this.dataFormDuration = JSON.parse(JSON.stringify(row.scheduling.duration))
      // deep copy of "row.work" into "dataFormWork"
      this.dataFormWork = JSON.parse(JSON.stringify(row.work))
      this.dialogFormStepVisible = true
      this.$nextTick(() => {
        this.$refs['refDataFormStep'].clearValidate()
      })
    },
    editCompatibility(row) {
      this.dialogTitleCompatibility = this.$t('supplierChain.editCompatibility')
      console.log(row)
      // this.dataFormDetail = [...row]
      this.dataFormCompatibility = JSON.parse(JSON.stringify(row))
      this.dialogFormCompatibilityVisible = true
      this.$nextTick(() => {
        this.$refs['refDataFormCompatibility'].clearValidate()
      })
    },
    addDetail() {
      this.resetdataFormDetail()
      this.dialogTitleDetail = this.$t('supplierChain.createDetail')
      this.dialogFormDetailVisible = true
      this.$nextTick(() => {
        this.$refs['refDataFormDetail'].clearValidate()
        this.$refs.idDetail.focus()// Put focus over the first input control
      })
    },
    addStep() {
      if (this.machinesList.length > 0) {
        this.resetdataFormStep()
        this.resetdataFormStart()
        this.resetdataFormDuration()
        this.resetdataFormWork()
        this.dialogTitleStep = this.$t('supplierChain.createStep')
        this.dialogFormStepVisible = true
        this.$nextTick(() => {
          this.$refs['refDataFormStep'].clearValidate()
        // this.$refs.name.focus()// Put focus over the first input control
        })
      } else {
        this.$message({
          type: pixelConstants.ERROR_MESSAGE_TYPE,
          message: this.$t('common.messageNoMachines')
        })
      }
    },
    addCompatibility() {
      if (this.shiftWorkList.length > 0 && this.cargoCategoryList.length > 0 && this.areaList.length > 0) {
        this.resetdataFormCompatibility()
        this.dialogTitleCompatibility = this.$t('supplierChain.createCompatibility')
        this.dialogFormCompatibilityVisible = true
        this.$nextTick(() => {
          this.$refs['refDataFormCompatibility'].clearValidate()
        // this.$refs.name.focus()// Put focus over the first input control
        })
      } else {
        // Mensaje para informar que debe rellenar alguna de estas tres entidades
        this.$message({
          type: pixelConstants.ERROR_MESSAGE_TYPE,
          message: this.$t('common.messageNoCreateCompatibility')
        })
      }
    },
    resetdataFormDetail() {
      this.dataFormDetail = {
        idDetail: '',
        label: '',
        comment: ''
      }
    },
    resetdataFormStep() {
      this.dataFormStep = {
        idSC: null,
        idStep: '',
        label: '',
        comment: '',
        category: '',
        scheduling: {
          start: null,
          duration: null
        },
        work: {}
      }
    },
    resetdataFormStart() {
      this.dataFormStart = {
        nature: '',
        value: null
      }
    },
    resetdataFormDuration() {
      this.dataFormDuration = {
        nature: '',
        value: null
      }
    },
    resetdataFormWork() {
      this.dataFormWork = {
        nature: '',
        distance: '',
        machines: []
      }
    },
    resetdataFormCompatibility() {
      this.dataFormCompatibility = {
        cargoes_category: [],
        directions_Nature: [],
        areas_ID: [],
        shiftworks_ID: []
      }
    },
    createDetail(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dataFormDetail.idSC = this.idSC
          console.log(this.dataFormDetail)
          detailCreate(this.dataFormDetail)
            .then(response => {
              this.dialogFormDetailVisible = false
              this.$notify({
                title: this.$t('common.success'),
                message: this.$t('common.createdSuccessfully'),
                type: 'success',
                duration: 2000
              })
              this.getListDetailsBySC()
              this.updateSC_Item()
            })
        }
      })
    },
    preValidateNameStep(formName) {
      var name = this.dataFormStep.idStep
      var createNewStep = true
      stepFetchList(this.listQuery).then(response => {
        var listStep = response.data
        if (listStep.length > 0) {
          // Compruebo los nombres para evitar repetidos
          listStep.forEach(step => {
            if (step.idStep === name) {
              createNewStep = false
            }
          })
          if (createNewStep) {
            // Procedo a crear el nuevo area
            this.createStep(formName)
          } else {
            // Mensaje indicando que debe de cambiar el nombre asignado al area
            this.$message({
              type: pixelConstants.ERROR_MESSAGE_TYPE,
              message: this.$t('common.noValidNameForStep')
            })
            console.log('Existe un Step con ese nombre por favor cambie el nombre')
          }
        } else {
          // Creo el area
          this.createStep(formName)
        }
      })
    },
    createStep(formName) {
      this.$refs['refDataFormWork'].validate(valid => {
        if (valid) {
          this.$refs[formName].validate(valid2 => {
            if (valid2) {
              this.dataFormStep.idSC = this.idSC
              this.dataFormStep.scheduling.start = this.dataFormStart
              this.dataFormStep.scheduling.duration = this.dataFormDuration
              this.dataFormStep.work = this.dataFormWork
              console.log(this.dataFormStep)
              stepCreate(this.dataFormStep).then(response => {
                this.dialogFormStepVisible = false
                this.$notify({
                  title: this.$t('common.success'),
                  message: this.$t('common.createdSuccessfully'),
                  type: 'success',
                  duration: 2000
                })
                this.getListStepsBySC()
                this.updateSC_Item()
                this.active = 0
              })
            }
          })
        }
      })
    },
    createCompatibility(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dataFormCompatibility.idSC = this.idSC
          console.log(this.dataFormCompatibility)
          compatibilityCreate(this.dataFormCompatibility)
            .then(response => {
              this.dialogFormCompatibilityVisible = false
              this.$notify({
                title: this.$t('common.success'),
                message: this.$t('common.createdSuccessfully'),
                type: 'success',
                duration: 2000
              })
              this.getListCompatibilityBySC()
              this.updateSC_Item()
            })
        }
      })
    },
    updateStep() {
      this.$refs['refDataFormWork'].validate(valid => {
        if (valid) {
          this.$refs['refDataFormStep'].validate(valid2 => {
            if (valid2) {
              this.dataFormStep.scheduling.start = this.dataFormStart
              this.dataFormStep.scheduling.duration = this.dataFormDuration
              this.dataFormStep.work = this.dataFormWork
              console.log(this.dataFormStep)
              stepUpdate(this.dataFormStep._id, this.dataFormStep)
                .then(response => {
                  this.dialogFormStepVisible = false
                  this.$notify({
                    title: this.$t('common.success'),
                    message: this.$t('common.updateSuccessfull'),
                    type: 'success',
                    duration: 2000
                  })
                  this.getListStepsBySC()
                  this.updateSC_Item()
                  this.active = 0
                })
                .catch(() => {
                  console.log('Error')
                })
            }
          })
        }
      })
    },
    updateDetail() {
      this.$refs['refDataFormDetail'].validate(valid => {
        if (valid) {
          console.log('UPDATE SC DETAILS')
          this.dataFormDetail
          detailUpdate(this.dataFormDetail._id, this.dataFormDetail)
            .then(response => {
              this.dialogFormDetailVisible = false
              this.$notify({
                title: this.$t('common.success'),
                message: this.$t('common.updateSuccessfull'),
                type: 'success',
                duration: 2000
              })
              this.getListDetailsBySC()
              this.updateSC_Item()
            })
            .catch(() => {
              console.log('Error')
            })
        }
      })
    },
    updateCompatibility() {
      this.$refs['refDataFormCompatibility'].validate(valid => {
        if (valid) {
          console.log('UPDATE COMPATIBILITY')
          this.dataFormCompatibility
          compatibilityUpdate(this.dataFormCompatibility._id, this.dataFormCompatibility)
            .then(response => {
              this.dialogFormCompatibilityVisible = false
              this.$notify({
                title: this.$t('common.success'),
                message: this.$t('common.updateSuccessfull'),
                type: 'success',
                duration: 2000
              })
              this.getListCompatibilityBySC()
              this.updateSC_Item()
            })
            .catch(() => {
              console.log('Error')
            })
        }
      })
    },
    updateSC_Item() {
      // Recupero el Supplier Chain por su ID
      supplierChainGet(this.idSC).then(response => {
        var supplierChain = response.data
        supplierChain.exportToIH_pending = true
        supplierChainUpdate(this.idSC, supplierChain).then(response => {
          console.log('SUPPLIER CHAIN UPDATED')
        }).catch(err => { console.error(err) })
      }).catch(() => {
        console.log('Error')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
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
  .SC-subheader {
        font-size: 35px;
        height:45px;
        color: #333;
        text-align: left;
        line-height: 45px !important;
        border-radius: 3px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        -ms-flex-negative: 0;
        flex-shrink: 0;
        display: block;
        width:100%
}
  .subTitle {
    margin:0px 0px 10px 0px !important;
    font-size:16px;
    color:#303030 !important;
    font-family:'Lato',sans-serif;
    font-weight:400
  }
</style>
