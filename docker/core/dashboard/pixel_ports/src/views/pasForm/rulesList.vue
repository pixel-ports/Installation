<template>
  <div class="app-container" :style="bgc">
    <!-- BACK BUTTON -->
    <div class="filter-container">
      <el-link
        type="primary"
        icon="el-icon-arrow-left"
        @click="gotoListOfRules"
      >{{ $t("common.back") }}</el-link>
    </div>
    <!-- TABLE FOR CARGO_CATEGORIES -->
    <div>
      <el-row class="rules-subheader">
        <span class="subTitle">{{ $t('rules.cargo_categoryHeader') }}</span>
        <el-button class="filter-item" style="float:right;" type="primary" icon="el-icon-plus" @click="addCargoCategory">
          {{ $t('rules.btnAddCargoCategory') }}
        </el-button>
      </el-row>
      <el-row style="background:#fff;margin-bottom:3px;">
        <el-table
          v-loading="listLoading"
          :data="cargoCategoryFilterByPagination"
          border
          fit
          style="width: 100%;"
          :empty-text="$t('common.emptyTable')"
        >
          <el-table-column :label="$t('rules.id')" align="center" :sortable="true" sort-by="id">
            <template slot-scope="{row}">
              <span>{{ row.idCargoCategory }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('rules.segment')" align="center">
            <template slot-scope="{row}">
              <span>{{ row.segment }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('rules.unit')" align="center">
            <template slot-scope="{row}">
              <span>{{ row.unit }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('resources.actions')" align="center" class-name="small-padding fixed-width">
            <template slot-scope="{row}">
              <!-- <el-button-group> -->
              <el-button size="small" class="editBtn" @click="editCargoCategory(row)">
                <i class="el-icon-edit">
                  {{ $t('common.btnEdit') }}
                </i>
              </el-button>
              <span style="padding-left:10px" />
              <el-button size="small" class="deleteBtn" @click="deleteCargoCategory(row)">
                <i class="el-icon-delete-solid">
                  {{ $t('common.btnDelete') }}
                </i>
              </el-button>
              <!-- </el-button-group> -->
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <pagination v-show="cargoCategoryFilterBySearchTextLength>0" style="margin-bottom:20px;" :total="cargoCategoryFilterBySearchTextLength" :page.sync="listQueryCargoCategory.page" :limit.sync="listQueryCargoCategory.limit" @pagination="getListCargoCategoryByRule" />

    </div>
    <!-- TABLE FOR SHIFTWORK -->
    <div>
      <el-row class="rules-subheader">
        <span class="subTitle">{{ $t('rules.shiftworkHeader') }}</span>
        <el-button class="filter-item" style="float:right;" type="primary" icon="el-icon-plus" @click="addShiftWork">
          {{ $t('rules.btnAddShiftWork') }}
        </el-button>
      </el-row>
      <el-row style="background:#fff;margin-bottom:3px;">
        <el-table
          v-loading="listLoading"
          :data="shiftWorkFilterByPagination"
          border
          fit
          style="width: 100%;"
          :empty-text="$t('common.emptyTable')"
        >
          <el-table-column :label="$t('rules.id')" align="center" :sortable="true" sort-by="id">
            <template slot-scope="{row}">
              <span>{{ row.idShiftWork }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('resources.actions')" align="center" class-name="small-padding fixed-width">
            <template slot-scope="{row}">
              <!-- <el-button-group> -->
              <el-button size="small" class="editBtn" @click="editShiftWork(row)">
                <i class="el-icon-edit">
                  {{ $t('common.btnEdit') }}
                </i>
              </el-button>
              <span style="padding-left:10px" />
              <el-button size="small" class="deleteBtn" @click="deleteShiftWork(row)">
                <i class="el-icon-delete-solid">
                  {{ $t('common.btnDelete') }}
                </i>
              </el-button>
              <!-- </el-button-group> -->
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <pagination v-show="shiftWorkFilterBySearchTextLength>0" style="margin-bottom:20px;" :total="shiftWorkFilterBySearchTextLength" :page.sync="listQueryShiftWork.page" :limit.sync="listQueryShiftWork.limit" @pagination="getListShiftWorkByRule" />
    </div>
    <!-- TABLE FOR PRIORITY -->
    <div>
      <el-row class="rules-subheader">
        <span class="subTitle">{{ $t('rules.priorityHeader') }}</span>
        <el-button :disabled="listPriority.length > 0" class="filter-item" style="float:right;" type="primary" icon="el-icon-plus" @click="addPriority">
          {{ $t('rules.btnAddPriority') }}
        </el-button>
      </el-row>
      <el-row style="background:#fff;margin-bottom:30px;">
        <el-table
          v-loading="listLoading"
          :data="listPriority"
          border
          fit
          style="width: 100%;"
          :empty-text="$t('common.emptyTable')"
        >
          <el-table-column :label="$t('rules.priorities')" align="center">
            <template slot-scope="{row}">
              <!-- <span>{{ (row.priority) }}</span> -->
              <el-tag v-for="(item, index) in row.priority" :key="index" style="margin-bottom:5px;margin-right:5px;" type="info">
                {{ index+1 }} - {{ item }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="$t('resources.actions')" align="center" class-name="small-padding fixed-width">
            <template slot-scope="{row}">
              <!-- <el-button-group> -->
              <el-button size="small" class="editBtn" @click="editPriority(row)">
                <i class="el-icon-edit">
                  {{ $t('common.btnEdit') }}
                </i>
              </el-button>
              <span style="padding-left:10px" />
              <el-button size="small" class="deleteBtn" @click="deletePriority(row)">
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
    <!-- TABLE FOR VALIDITY -->

    <!-- TABLE FOR ASSIGNMENT -->

    <!-- dialog for Edit / Update Area -->

    <!-- DIALOG FOR EDITING / UPDATING CARGO CATEGORY -->
    <div>
      <el-dialog
        :visible.sync="dialogFormCargoCategoryVisible"
        :title="dialogTitleCargoCategory"
        width="60%"
        hide-overlay
        transition="dialog-bottom-transition"
        :before-close="handleCloseDialog"
      >
        <el-form
          ref="refDataFormCargoCategory"
          :rules="rulesCargoCategory"
          :model="dataFormCargoCategory"
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
                <el-step :title="$t('rules.general')" />
                <el-step :title="$t('rules.assignationPreference')" />
                <el-step :title="$t('rules.typicalRange')" />
              </el-steps>
            </el-header>

            <el-main>
              <el-row v-if="active == 0">
                <el-col :span="24">
                  <el-form-item
                    :label="$t('rules.id_')"
                    :label-width="labelWidth"
                    :label-position="labelPosition"
                    prop="idCargoCategory"
                  >
                    <el-input v-if="dialogTitleCargoCategory === $t('rules.createCargoesCategory')" v-model="dataFormCargoCategory.idCargoCategory" />

                    <el-input v-else v-model="dataFormCargoCategory.idCargoCategory" :disabled="true" />

                    <!--<el-input v-model="dataFormCargoCategory.idCargoCategory" />-->
                  </el-form-item>
                  <el-form-item
                    :label="$t('rules.segment_')"
                    :label-width="labelWidth"
                    :label-position="labelPosition"
                    prop="segment"
                  >
                    <el-select v-model="dataFormCargoCategory.segment" class="filter-item" :placeholder="$t('rules.selectSegment')" style="width:100%">
                      <el-option
                        v-for="item in availableSegments"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        multiple
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    :label="$t('rules.unit_')"
                    :label-width="labelWidth"
                    :label-position="labelPosition"
                    prop="unit"
                  >
                    <!-- <el-input v-model="dataFormCargoCategory.unit" /> -->
                    <el-select v-model="dataFormCargoCategory.unit" class="filter-item" :placeholder="$t('models.selectUnit')" filterable allow-create style="width:100%">
                      <el-option
                        v-for="item in typeCargoesCategory"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row v-if="active == 1">
                <el-row style="background:#fff;margin-bottom:30px;margin-top:10px;">
                  <el-form
                    ref="refDataFormPreference"
                    :rules="rulesPreference"
                    :model="dataFormPreference"
                    :label-position="labelPosition"
                    label-width="100px"
                  >

                    <el-form-item
                      :label="$t('rules.priority_')"
                      :label-width="labelWidth_long"
                      :label-position="labelPosition"
                    >
                      <!-- <el-input-number v-model.number="dataFormPreference.priority" :min="1" :disabled="editPreference" /> -->
                      <el-input-number v-if="editPreference" v-model.number="dataFormPreference.priority" disabled />
                      <!-- <el-input-number v-else :value="getNextAvailablePreference" :min="1" disabled /> -->
                      <el-input-number v-else v-model.number="dataFormPreference.priority" :min="1" disabled />
                    </el-form-item>
                    <el-form-item
                      :label="$t('rules.direction_')"
                      :label-width="labelWidth_long"
                      :label-position="labelPosition"
                      prop="direction"
                    >
                      <el-select v-model="dataFormPreference.direction" clearable class="filter-item" :placeholder="$t('rules.selectDirection')" style="width:100%">
                        <el-option
                          v-for="direction in directions"
                          :key="direction.value"
                          :label="direction.label"
                          :value="direction.value"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item
                      :label="$t('rules.dock_ID_')"
                      :label-width="labelWidth_long"
                      :label-position="labelPosition"
                      prop="dock_ID"
                    >
                      <el-input v-model="dataFormPreference.dock_ID" />
                    </el-form-item>
                    <el-form-item
                      :label="$t('rules.supplyChainID_')"
                      :label-width="labelWidth_long"
                      :label-position="labelPosition"
                      prop="supply_chain_ID"
                    >
                      <el-select v-model="dataFormPreference.supply_chain_ID" class="filter-item" :placeholder="$t('models.selectType')" style="width:100%">
                        <el-option
                          v-for="item in supplierChainList"
                          :key="item.name"
                          :label="item.name"
                          :value="item.name"
                        />
                      </el-select>
                      <!--<el-input v-model="dataFormPreference.supply_chain_ID" />-->
                    </el-form-item>
                  </el-form>

                  <el-button type="danger" @click="cancelPreference">
                    {{ $t('common.cancel') }}
                  </el-button>
                  <el-button v-if="editPreference" class="filter-item" style="float:right;" type="primary" icon="el-icon-plus" @click="updatePreference">
                    {{ $t('common.update') }}
                  </el-button>
                  <el-button v-else class="filter-item" style="float:right;" type="primary" icon="el-icon-plus" @click="addPreference">
                    {{ $t('rules.addPreference') }}
                  </el-button>
                </el-row>
                <el-divider />
                <!-- <el-row>
                  {{ $t('rules.messageDraggable') }}
                </el-row> -->
                <el-row style="background:#fff;margin-bottom:30px;margin-top:10px;">
                  <el-table
                    ref="dragTable"
                    v-loading="listLoading"
                    :data="listPreference"
                    row-key="priority"
                    border
                    fit
                    style="width: 100%;"
                    :empty-text="$t('common.emptyTable')"
                  >
                    <!-- <el-table-column align="center" :label="$t('common.drag')" width="80">
                      <template slot-scope="{}">
                        <svg-icon class="drag-handler" icon-class="drag" />
                      </template>
                    </el-table-column> -->
                    <el-table-column :label="$t('rules.priority')" align="center">
                      <template slot-scope="{row}">
                        <span>{{ row.priority }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column :label="$t('rules.direction')" align="center">
                      <template slot-scope="{row}">
                        <span>{{ row.direction }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column :label="$t('rules.dock_ID')" align="center">
                      <template slot-scope="{row}">
                        <span>{{ row.dock_ID }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column :label="$t('rules.supplyChainID')" align="center">
                      <template slot-scope="{row}">
                        <span>{{ row.supply_chain_ID }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column :label="$t('rules.actions')" align="center" class-name="small-padding fixed-width">
                      <template slot-scope="{row}">
                        <el-button size="small" class="editBtn" @click="editItemPreference(row)">
                          <i class="el-icon-edit">
                            {{ $t('common.btnEdit') }}
                          </i>
                        </el-button>
                        <span style="padding-left:10px" />
                        <el-button size="small" class="deleteBtn" @click="deleteItemPreference(row)">
                          <i class="el-icon-delete-solid">
                            {{ $t('common.btnDelete') }}
                          </i>
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-row>
                <!-- <el-row>
                  <div class="show-d">
                    <el-tag>The default order :</el-tag> {{ oldList }}
                  </div>
                  <div class="show-d">
                    <el-tag>The after dragging order :</el-tag> {{ newList }}
                  </div>
                </el-row> -->
                <el-row>
                  {{ $t('rules.messagePreferenceValidation') }}
                </el-row>
              </el-row>

              <el-row v-if="active == 2">
                <el-form
                  ref="refDataFormRange"
                  :rules="rulesRange"
                  :model="dataFormRange"
                  :label-position="labelPosition"
                  label-width="100px"
                >

                  <el-form-item
                    :label="$t('rules.lowerLimit_')"
                    :label-width="labelWidth"
                    :label-position="labelPosition"
                    prop="lower"
                  >
                    <el-input-number v-model.number="dataFormRange.lower" :min="0" />
                  </el-form-item>
                  <el-form-item
                    :label="$t('rules.upperLimit_')"
                    :label-width="labelWidth"
                    :label-position="labelPosition"
                    prop="upper"
                  >
                    <el-input-number v-model.number="dataFormRange.upper" :min="dataFormRange.lower" />
                  </el-form-item>
                </el-form>
              </el-row>

            </el-main>
          </el-container>
        </el-form>
        <el-row>
          <el-button style="float:left;" :disabled="active < 1" @click="active--">
            {{ $t("widget.buttonPrevius") }}
          </el-button>
          <!-- <el-button
            v-if="active < 2"
            style="float:right;"
            type="primary"
            @click="showRefs()"
          >
            Show Refs
          </el-button> -->
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
              dialogTitleCargoCategory === $t('rules.createCargoesCategory')
                ? preValidateNameCargoCategory('refDataFormCargoCategory')
                : updateCargoCategory()
            "
          >
            {{ $t('common.confirm') }}
          </el-button>
        </el-row>
      </el-dialog>
    </div>
    <!-- DIALOG FOR EDITING / UPDATING SHIFTWORK -->
    <div>
      <el-dialog :title="dialogTitleShiftWork" :visible.sync="dialogFormShiftWorkVisible" width="60%" hide-overlay transition="dialog-bottom-transition" :before-close="handleCloseDialog">
        <el-form ref="refDataFormShiftWork" :rules="rulesShiftWork" :model="dataFormShiftWork" :label-position="labelPosition" label-width="100px">
          <el-row align="center">
            <el-form-item :label="$t('rules.id_')" :label-position="labelPosition" prop="idShiftWork">

              <el-input v-if="dialogTitleShiftWork===$t('rules.createShiftWork')" v-model="dataFormShiftWork.idShiftWork" />

              <el-input v-else v-model="dataFormShiftWork.idShiftWork" :disabled="true" />

              <!--<el-input v-model="dataFormShiftWork.idShiftWork" />-->
            </el-form-item>
          </el-row>
          <el-row style="background:#fff;margin-bottom:30px;margin-top:10px;">
            <el-table
              v-loading="listLoading"
              :data="dataFormShiftWork.value"
              border
              fit
              style="width: 100%;"
              :empty-text="$t('resources.emptyTable')"
            >
              <el-table-column :label="$t('rules.day')" align="center">
                <template slot-scope="{row}">
                  <span>{{ row.day }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('rules.firstHalf')" align="center">
                <template slot-scope="{row}">
                  <el-row>
                    <!--<el-time-picker
                      v-model="row.firstHalfControl"
                      size="mini"
                      style="width:95%"
                      is-range
                      range-separator=">"
                      :start-placeholder="$t('rules.start')"
                      :end-placeholder="$t('rules.end')"
                      :picker-options="{
                        start: '00:00',
                        end: '24:00'
                      }"
                      format="HH:mm"
                    />-->
                    <el-col :span="12">
                      <el-time-select
                        v-model="row.startFirstShift"
                        size="mini"
                        style="width:95%"
                        :placeholder="$t('rules.start')"
                        :picker-options="{
                          start: '00:00',
                          step: '00:15',
                          end: '24:00'
                        }"
                      />
                    </el-col>
                    <el-col :span="12">
                      <el-time-select
                        v-model="row.endFirstShift"
                        size="mini"
                        style="width:95%"
                        :placeholder="$t('rules.end')"
                        :picker-options="{
                          start: '00:00',
                          step: '00:15',
                          end: '24:00'
                        }"
                      />
                    </el-col>
                  </el-row>

                </template>
              </el-table-column>
              <el-table-column :label="$t('rules.secondHalf')" align="center">
                <template slot-scope="{row}">
                  <el-row>
                    <!--<el-time-picker
                      v-model="row.secondHalfControl"
                      size="mini"
                      style="width:95%"
                      is-range
                      range-separator=">"
                      :start-placeholder="$t('rules.start')"
                      :end-placeholder="$t('rules.end')"
                      :picker-options="{
                        start: '00:00',
                        end: '24:00'
                      }"
                      format="HH:mm"
                    />-->
                    <el-col :span="12">
                      <el-time-select
                        v-model="row.startSecondShift"
                        size="mini"
                        style="width:95%"
                        :placeholder="$t('rules.start')"
                        :picker-options="{
                          start: '00:00',
                          step: '00:15',
                          end: '24:00'
                        }"
                      />
                    </el-col>
                    <el-col :span="12">
                      <el-time-select
                        v-model="row.endSecondShift"
                        size="mini"
                        style="width:95%"
                        :placeholder="$t('rules.end')"
                        :picker-options="{
                          start: '00:00',
                          step: '00:15',
                          end: '24:00'
                        }"
                      />
                    </el-col>
                  </el-row>
                </template>
              </el-table-column>

            </el-table>

          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="danger" @click="dialogFormShiftWorkVisible = false">
            {{ $t('common.cancel') }}
          </el-button>
          <el-button type="success" @click="dialogTitleShiftWork===$t('rules.createShiftWork') ? preValidateNameShiftWork('refDataFormShiftWork') : updateShiftWork()">
            {{ $t('common.confirm') }}
          </el-button>
        </div>
      </el-dialog>
    </div>
    <!-- DIALOG FOR EDITING / UPDATING PRIORITIES -->
    <div>
      <el-dialog :title="dialogTitlePriority" :visible.sync="dialogFormPriorityVisible" width="60%" hide-overlay transition="dialog-bottom-transition" :before-close="handleCloseDialog">
        <el-form
          ref="refDataFormPriority"
          :model="dataFormSelectedPriority"
          :rules="rulesPriority"
          :label-position="labelPosition"
          label-width="100px"
        >

          <el-form-item prop="priority">
            <el-transfer
              v-model="dataFormSelectedPriority.priority"
              :data="listAvailablePriorities"
              target-order="push"
              :titles="[$t('common.available'), $t('common.selected')]"
            />
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="danger" @click="dialogFormPriorityVisible = false">
            {{ $t('common.cancel') }}
          </el-button>
          <el-button type="success" @click="dialogTitlePriority === $t('rules.addPriority') ? createPriority('refDataFormPriority') : updatePriority()">
            {{ $t('common.confirm') }}
          </el-button>
        </div>
      </el-dialog>
    </div>
    <!-- DIALOG FOR EDITING / UPDATING VALIDITIES -->

    <!-- BACK BUTTON -->
    <div class="filter-container">
      <el-link
        type="primary"
        icon="el-icon-arrow-left"
        @click="gotoListOfRules"
      >{{ $t("common.back") }}
      </el-link>
    </div>
  </div>
</template>

<script>
import {
  cargoCategoryFetchList,
  cargoCategoryFilterByRule,
  cargoCategoryCreate,
  cargoCategoryUpdate,
  cargoCategoryDelete
} from '@/api/cargoCategory'
import {
  shiftWorkFetchList,
  shiftWorkFilterByRule,
  shiftWorkCreate,
  shiftWorkUpdate,
  shiftWorkDelete
} from '@/api/shiftWork'
import {
  priorityFilterByRule,
  priorityCreate,
  priorityUpdate,
  priorityDelete
} from '@/api/priority'
import cargoesCategoryUnitType from './files/cargoesCategoryUnitType.json'
import { ruleGet, ruleUpdate } from '@/api/rule'
import { machineFilterByShiftWork } from '@/api/machine'
import { compatibilityFetchList } from '@/api/compatibility'
import { supplierChainFetchList } from '@/api/supplierChain'
import pixelConstants from '@/utils/constants' // import class for constants
import waves from '@/directive/waves' // waves directive
import segmentType from './files/segmentType.json'
import Pagination from '@/components/Pagination'
import Sortable from 'sortablejs'
export default {
  name: 'RulesList',
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
      active: 0,
      directions: [
        {
          value: 'loading',
          label: 'loading'
        },
        {
          value: 'unloading',
          label: 'unloading'
        },
        {
          value: 'other',
          label: 'other'
        }
      ],
      labelPosition: 'left',
      dialogFormCargoCategoryVisible: false,
      dialogFormShiftWorkVisible: false,
      dialogFormPriorityVisible: false,
      dialogTitleCargoCategory: '',
      dialogTitleShiftWork: '',
      dialogTitlePriority: '',
      labelColumn: '110px',
      labelWidth: '130px',
      labelWidth_long: '160px',
      // labelWidth_Groups: '80px',
      editPreference: false,
      dataFormCargoCategory: {
        _id: '',
        idCargoCategory: '',
        idRule: null,
        segment: '',
        unit: '',
        typical_amount_range: [],
        assignation_preference: {
          priority: '',
          direction: '',
          dock_ID: '',
          supply_chain_ID: ''
        }
      },
      dataFormPreference: {
        priority: '',
        direction: '',
        dock_ID: '',
        supply_chain_ID: ''
      },
      dataFormRange: {
        lower: '',
        upper: ''
      },
      dataFormShiftWork: {
        _id: '',
        idRule: '',
        idShiftWork: '',
        value: [
          {
            day: 'Monday',
            /* firstHalfControl: '',
            secondHalfControl: ''*/
            startFirstShift: '',
            endFirstShift: '',
            startSecondShift: '',
            endSecondShift: ''
          },
          {
            day: 'Tuesday',
            /* firstHalfControl: '',
            secondHalfControl: ''*/
            startFirstShift: '',
            endFirstShift: '',
            startSecondShift: '',
            endSecondShift: ''
          },
          {
            day: 'Wednesday',
            /* firstHalfControl: '',
            secondHalfControl: ''*/
            startFirstShift: '',
            endFirstShift: '',
            startSecondShift: '',
            endSecondShift: ''
          },
          {
            day: 'Thursday',
            /* firstHalfControl: '',
            secondHalfControl: ''*/
            startFirstShift: '',
            endFirstShift: '',
            startSecondShift: '',
            endSecondShift: ''
          },
          {
            day: 'Friday',
            /* firstHalfControl: '',
            secondHalfControl: ''*/
            startFirstShift: '',
            endFirstShift: '',
            startSecondShift: '',
            endSecondShift: ''
          },
          {
            day: 'Saturday',
            /* firstHalfControl: '',
            secondHalfControl: ''*/
            startFirstShift: '',
            endFirstShift: '',
            startSecondShift: '',
            endSecondShift: ''
          },
          {
            day: 'Sunday',
            /* firstHalfControl: '',
            secondHalfControl: ''*/
            startFirstShift: '',
            endFirstShift: '',
            startSecondShift: '',
            endSecondShift: ''
          }
        ]
      },
      dataFormPriority: {
        _id: '',
        idRule: '',
        // idPriority: '',
        priority: []
      },
      dataFormSelectedPriority: {
        priority: []
      },
      listQueryCargoCategory: {
        page: 1,
        limit: 5,
        text: undefined,
        type: undefined,
        idResource: undefined
      },
      listQueryStepList: {
        text: undefined,
        type: undefined
      },
      listQueryPriority: {
        text: undefined,
        type: undefined
      },
      listQueryShiftWork: {
        page: 1,
        limit: 5,
        text: undefined,
        type: undefined,
        idResource: undefined
      },
      // sortable: null,
      // oldList: [],
      // newList: [],
      listLoading: true,
      listCargoCategory: [],
      listShiftWork: [],
      listPreference: [],
      listPriority: [],
      listRange: [],
      supplierChainList: [],
      H: 'HASARDOUS',
      F: 'FIFO',
      indexPreference: 0,
      rulesCargoCategory: {
        idCargoCategory: [
          {
            required: true,
            message: this.$t('rules.errIDRequired'),
            trigger: 'blur'
          }
        ],
        segment: [
          {
            required: true,
            message: this.$t('rules.errSegmentRequired'),
            trigger: 'blur'
          }
        ],
        unit: [
          {
            required: true,
            message: this.$t('rules.errUnitRequired'),
            trigger: 'blur'
          }
        ]
      },
      rulesPreference: {
        priority: [
          {
            required: true,
            message: this.$t('rules.errPriorityRequired'),
            trigger: 'blur'
          }
        ],
        direction: [
          {
            required: true,
            message: this.$t('rules.errDirectionRequired'),
            trigger: 'blur'
          }
        ],
        dock_ID: [
          {
            required: true,
            message: this.$t('rules.errDockIDRequired'),
            trigger: 'blur'
          }
        ],
        supply_chain_ID: [
          {
            required: true,
            message: this.$t('rules.errSupplyChainIDRequired'),
            trigger: 'blur'
          }
        ]
      },
      rulesShiftWork: {
        'idShiftWork': [
          {
            required: true,
            message: this.$t('rules.errIDRequired'),
            trigger: 'blur'
          }
        ]
      },
      rulesPriority: {
        priority: [
          {
            required: true,
            message: this.$t('rules.errOnePriorityRequired'),
            trigger: 'change'
          }
        ]
      },
      rulesRange: {
        lower: [
          {
            required: true,
            message: this.$t('rules.errLowerLimitRequired'),
            trigger: 'blur'
          }
        ],
        upper: [
          {
            required: true,
            message: this.$t('rules.errUpperLimitRequired'),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    getNextAvailablePreference() {
      if (this.listPreference && this.listPreference.length > 0) {
        return this.listPreference.length + 1
      } else {
        return 1
      }
    },
    typeCargoesCategory() {
      return cargoesCategoryUnitType
    },
    cargoCategoryFilterBySearchText() {
      return this.listCargoCategory
    },
    cargoCategoryFilterBySearchTextLength() {
      return this.cargoCategoryFilterBySearchText.length
    },
    cargoCategoryFilterByPagination() {
      const page = this.listQueryCargoCategory.page
      const limit = this.listQueryCargoCategory.limit

      if (Math.ceil(this.cargoCategoryFilterBySearchTextLength / limit) >= page) {
        return this.cargoCategoryFilterBySearchText.slice((page - 1) * limit, page * limit)
      } else {
        return this.cargoCategoryFilterBySearchText.slice(0, limit)
      }
    },
    shiftWorkFilterBySearchText() {
      return this.listShiftWork
    },
    shiftWorkFilterBySearchTextLength() {
      return this.shiftWorkFilterBySearchText.length
    },
    shiftWorkFilterByPagination() {
      const page = this.listQueryShiftWork.page
      const limit = this.listQueryShiftWork.limit

      if (Math.ceil(this.shiftWorkFilterBySearchTextLength / limit) >= page) {
        return this.shiftWorkFilterBySearchText.slice((page - 1) * limit, page * limit)
      } else {
        return this.shiftWorkFilterBySearchText.slice(0, limit)
      }
    },
    listAvailablePriorities() {
      let temp = []
      if (this.listCargoCategory && this.listCargoCategory.length > 0) {
        const listCargoCategoryNames = this.listCargoCategory.map(item => {
          return item.idCargoCategory
        })
        temp = [this.H, this.F, ...listCargoCategoryNames]
        return temp.map((item, index) => { return { key: index, label: item } })
      } else {
        temp = [this.H, this.F]
        return [{ key: 0, label: this.H }, { key: 1, label: this.F }]
      }
    },
    datePickerSize() {
      return '' // empty string means normal size
    },
    idRule() {
      console.log('idRule = ', this.$route.params.id)
      return this.$route.params.id
    },
    availableSegments() {
      return segmentType
    }
  },
  watch: {},
  created() {
    this.getListCargoCategoryByRule()
    this.getListShiftWorkByRule()
    this.getPriorityByRule()
    // Needed before to create a Cargo Category
    this.recoverSupplierChain()
  },
  methods: {
    gotoListOfRules() {
      this.$router.push({ name: 'Rules' })
    },
    recoverSupplierChain() {
      supplierChainFetchList(this.listQuery).then(response => {
        this.supplierChainList = response.data
        console.log('SupplierChain existentes:')
        console.log(this.supplierChainList)
      }).catch(err => {
        console.error(err)
      })
    },
    // showRefs() {
    //   this.setSort()
    // },
    validateStep() {
      if (this.active === 0) {
        return new Promise((resolve, reject) => {
          this.$refs.refDataFormCargoCategory.validate(valid => {
            if (valid) {
              this.active++
            }
          })
        })
      }
      if (this.active === 1) {
        return new Promise((resolve, reject) => {
          this.$refs.refDataFormCargoCategory.validate(valid => {
            // resolve(valid)
            if (valid && this.listPreference.length > 0) {
              // this.listPreference.map((item, index) => { item.priority = index })
              this.active++
            } else {
              this.$message({
                type: pixelConstants.WARNING_MESSAGE_TYPE,
                message: this.$t('rules.messagePreferenceValidation')
              })
            }
          })
        })
      }
    },
    shiftWorkToUI(array) {
      // transforms the "ShiftWorks" array from the server into a table-friendly format.
      const result = array.map(shift => {
        const _id = shift._id
        const idRule = shift.idRule
        const idShiftWork = shift.idShiftWork
        // const createdAt = shift.createdAt
        // const updatedAt = shift.updatedAt
        const value = shift.value.map(dayItem => {
          const dayItemKey = Object.keys(dayItem)[0]
          const dayItemValue = Object.values(dayItem)[0]
          return {
            day: dayItemKey,
            startFirstShift: dayItemValue.length > 0 ? dayItemValue[0].split('>')[0] : '',
            endFirstShift: dayItemValue.length > 0 ? dayItemValue[0].split('>')[1] : '',
            startSecondShift: dayItemValue.length > 1 ? dayItemValue[1].split('>')[0] : '',
            endSecondShift: dayItemValue.length > 1 ? dayItemValue[1].split('>')[1] : ''
          }
        })
        return {
          _id: _id,
          idRule: idRule,
          idShiftWork: idShiftWork,
          // createdAt: createdAt,
          // updatedAt: updatedAt,
          value: value
        }
      })
      return result
    },
    shiftWorkToServer(array) {
      // transforms the "ShiftWorks" array used in the tables into a Server format.
      const result = array.map(shift => {
        const _id = shift._id
        const idRule = shift.idRule
        const idShiftWork = shift.idShiftWork
        const value = shift.value.map(dayItem => {
          if (dayItem.startFirstShift && dayItem.endFirstShift && dayItem.startSecondShift && dayItem.endSecondShift) {
            return {
              [dayItem.day]: [
                `${dayItem.startFirstShift}>${dayItem.endFirstShift}`,
                `${dayItem.startSecondShift}>${dayItem.endSecondShift}`
              ]
            }
          } else if (!dayItem.startFirstShift || !dayItem.endFirstShift) {
            if (dayItem.startSecondShift && dayItem.endSecondShift) {
              return {
                [dayItem.day]: [`${dayItem.startSecondShift}>${dayItem.endSecondShift}`]
              }
            } else {
              return {
                [dayItem.day]: []
              }
            }
          } else if (!dayItem.startSecondShift || !dayItem.endSecondShift) {
            if (dayItem.startFirstShift && dayItem.endFirstShift) {
              return {
                [dayItem.day]: [`${dayItem.startFirstShift}>${dayItem.endFirstShift}`]
              }
            }	else {
              return {
                [dayItem.day]: []
              }
            }
          } else {
            return {
              [dayItem.day]: []
            }
          }
        })
        return {
          _id: _id,
          idRule: idRule,
          idShiftWork: idShiftWork,
          // createdAt: createdAt,
          // updatedAt: updatedAt,
          value: value
        }
      })
      return result
    },
    getListCargoCategoryByRule() {
      this.listLoading = true
      cargoCategoryFilterByRule(this.idRule)
        .then(response => {
          console.log('CARGO_CATEGORIES DE MONGODB')
          console.log(response.data)
          this.listCargoCategory = response.data
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
        .catch(err => {
          console.error(err)
        })
    },
    getListShiftWorkByRule() {
      this.listLoading = true
      shiftWorkFilterByRule(this.idRule)
        .then(response => {
          console.log('SHIFTWORKS DE MONGODB')
          // console.log(response.data)
          this.listShiftWork = this.shiftWorkToUI(response.data)
          console.log(this.listShiftWork)
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
        .catch(err => {
          console.error(err)
        })
    },
    getPriorityByRule() {
      this.listLoading = true
      priorityFilterByRule(this.idRule)
        .then(response => {
          console.log('PRIORITY DE MONGODB')
          this.listPriority = response.data
          console.log(this.listPriority)
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
        .catch(err => {
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
          // this.resetdataFormCargoCategory()
          // this.resetdataFormPreference()
          // this.resetdataFormRange()
          // this.resetdataFormShiftWork()
          // this.resetdataFormPriority()
          // this.resetdataFormSelectedPriority()
        })
        .catch(_ => {})
    },
    deleteCargoCategory(row) {
      var idCargoCategory = row.idCargoCategory
      console.log(idCargoCategory)
      compatibilityFetchList(this.listQueryStepList).then(response => {
        var compatibilityList = response.data
        console.log('Compatibilities')
        console.log(compatibilityList)
        if (compatibilityList.length > 0) {
          compatibilityList.forEach(cmp => {
            if (cmp.cargoes_category.includes(idCargoCategory)) {
            // console.log('Lo incluye')
              this.$message({
                type: pixelConstants.ERROR_MESSAGE_TYPE,
                message: this.$t('common.compatibilityRelatedToCargoCategory')
              })
            } else {
            // Tengo que comprobar ahora que el elemento no este incluido en Priority
              console.log('Voy a comprobar si hay algun registro relacionado con Priorities')
              priorityFilterByRule(this.idRule).then(response => {
                var priorityList = response.data
                console.log('Priorities')
                console.log(priorityList)
                if (priorityList.length > 0) {
                  console.log('Examino dentro del listado de Prioridades')
                  priorityList.forEach(pri => {
                    if (pri.priority.includes(idCargoCategory)) {
                      // Se incluye por tanto mensaje de error
                      this.$message({
                        type: pixelConstants.ERROR_MESSAGE_TYPE,
                        message: this.$t('common.priorityRelatedToCargoCategory')
                      })
                    } else {
                      this.$confirm(
                        this.$t('common.removeCargoCategory'),
                        this.$t('common.deleteCargoCategory'),
                        {
                          confirmButtonText: this.$t('common.confirm'),
                          cancelButtonText: this.$t('common.cancel'),
                          type: pixelConstants.WARNING_MESSAGE_TYPE
                        }
                      )
                        .then(async() => {
                          await cargoCategoryDelete(row._id)
                          this.getListCargoCategoryByRule()
                          this.updateRuleItem()
                          this.$message({
                            type: pixelConstants.SUCCESS_MESSAGE_TYPE,
                            message: this.$t('common.deleteSucced')
                          })
                          // here we should update Priorities to make sure we dont have any deleted CargoCategory in our current Priorities
                          this.updatePriorityWhenCargoCategoryIsDeleted(row.idCargoCategory)
                        })
                        .catch(err => {
                          console.error(err)
                        })
                    }
                  })
                } else {
                  console.log('No tengo prioridades')
                  this.$confirm(
                    this.$t('common.removeCargoCategory'),
                    this.$t('common.deleteCargoCategory'),
                    {
                      confirmButtonText: this.$t('common.confirm'),
                      cancelButtonText: this.$t('common.cancel'),
                      type: pixelConstants.WARNING_MESSAGE_TYPE
                    }
                  )
                    .then(async() => {
                      await cargoCategoryDelete(row._id)
                      this.getListCargoCategoryByRule()
                      this.updateRuleItem()
                      this.$message({
                        type: pixelConstants.SUCCESS_MESSAGE_TYPE,
                        message: this.$t('common.deleteSucced')
                      })
                      // here we should update Priorities to make sure we dont have any deleted CargoCategory in our current Priorities
                      this.updatePriorityWhenCargoCategoryIsDeleted(row.idCargoCategory)
                    })
                    .catch(err => {
                      console.error(err)
                    })
                }
              })
            }
          })
        } else {
          // Vamos a comprobar si hay algún registro de Priority
          console.log('Voy a ver si hay algun registro relacionado con Priorities')
          priorityFilterByRule(this.idRule).then(response => {
            var priorityList = response.data
            console.log('Priorities')
            console.log(priorityList)
            if (priorityList.length > 0) {
              priorityList.forEach(pri => {
                if (pri.priority.includes(idCargoCategory)) {
                // Se incluye por tanto mensaje de error
                  this.$message({
                    type: pixelConstants.ERROR_MESSAGE_TYPE,
                    message: this.$t('common.priorityRelatedToCargoCategory')
                  })
                } else {
                  console.log('No hay ningun registro de Priority.')
                  this.$confirm(
                    this.$t('common.removeCargoCategory'),
                    this.$t('common.deleteCargoCategory'),
                    {
                      confirmButtonText: this.$t('common.confirm'),
                      cancelButtonText: this.$t('common.cancel'),
                      type: pixelConstants.WARNING_MESSAGE_TYPE
                    }
                  )
                    .then(async() => {
                      await cargoCategoryDelete(row._id)
                      this.getListCargoCategoryByRule()
                      this.updateRuleItem()
                      this.$message({
                        type: pixelConstants.SUCCESS_MESSAGE_TYPE,
                        message: this.$t('common.deleteSucced')
                      })
                      // here we should update Priorities to make sure we dont have any deleted CargoCategory in our current Priorities
                      this.updatePriorityWhenCargoCategoryIsDeleted(row.idCargoCategory)
                    })
                    .catch(err => {
                      console.error(err)
                    })
                }
              })
            } else {
              // No tengo ni Priority ni Supply Chain asociado. Borro el registro
              console.log('Procedo a borrar. No hay registros de Priorities')
              this.$confirm(
                this.$t('common.removeCargoCategory'),
                this.$t('common.deleteCargoCategory'),
                {
                  confirmButtonText: this.$t('common.confirm'),
                  cancelButtonText: this.$t('common.cancel'),
                  type: pixelConstants.WARNING_MESSAGE_TYPE
                }
              )
                .then(async() => {
                  await cargoCategoryDelete(row._id)
                  this.getListCargoCategoryByRule()
                  this.updateRuleItem()
                  this.$message({
                    type: pixelConstants.SUCCESS_MESSAGE_TYPE,
                    message: this.$t('common.deleteSucced')
                  })
                  // here we should update Priorities to make sure we dont have any deleted CargoCategory in our current Priorities
                  this.updatePriorityWhenCargoCategoryIsDeleted(row.idCargoCategory)
                })
                .catch(err => {
                  console.error(err)
                })
            }
          })
        }
      })
    },
    deleteShiftWork(row) {
      // Compruebo primero si no existe ningun shiftWork que se este usando para definir maquinas ó compatibility
      var idShiftWork = row.idShiftWork
      console.log(idShiftWork)
      machineFilterByShiftWork(idShiftWork).then(response => {
        var listShiftWorkRelated = response.data
        console.log(listShiftWorkRelated)
        if (listShiftWorkRelated.length > 0) {
          // Muestro mensaje diciendo que no se puede borrar el registro
          console.log('Hay registros relacionados de maquinas')
          this.$message({
            type: pixelConstants.ERROR_MESSAGE_TYPE,
            message: this.$t('common.machineRelatedToShiftWork') + listShiftWorkRelated[0].idMachine + this.$t('common.correctMachineRegister')
          })
        } else {
          // Una vez comprobado que no hay maquinas relacionadas compruebo que no hay compatiblities relacionados
          compatibilityFetchList(this.listQueryStepList).then(response => {
            var compatibilityList = response.data
            console.log('Compatibilities')
            console.log(compatibilityList)
            if (compatibilityList.length > 0) {
              console.log('Vammos a comprobar dentro del listado de compatibilities')
              compatibilityList.forEach(cmp => {
                if (cmp.shiftworks_ID.includes(idShiftWork)) {
                // console.log('Lo incluye')
                  this.$message({
                    type: pixelConstants.ERROR_MESSAGE_TYPE,
                    message: this.$t('common.compatibilityRelatedToShiftWork')
                  })
                } else {
                  this.$confirm(
                    this.$t('common.removeShiftWork'),
                    this.$t('common.deleteShiftWork'),
                    {
                      confirmButtonText: this.$t('common.confirm'),
                      cancelButtonText: this.$t('common.cancel'),
                      type: pixelConstants.WARNING_MESSAGE_TYPE
                    }
                  )
                    .then(async() => {
                      await shiftWorkDelete(row._id)
                      this.getListShiftWorkByRule()
                      this.updateRuleItem()
                      this.$message({
                        type: pixelConstants.SUCCESS_MESSAGE_TYPE,
                        message: this.$t('common.deleteSucced')
                      })
                    })
                    .catch(err => {
                      console.error(err)
                    })
                }
              })
            } else {
              console.log('No hay ni maquinas ni compatibilidades asociadas')
              this.$confirm(
                this.$t('common.removeShiftWork'),
                this.$t('common.deleteShiftWork'),
                {
                  confirmButtonText: this.$t('common.confirm'),
                  cancelButtonText: this.$t('common.cancel'),
                  type: pixelConstants.WARNING_MESSAGE_TYPE
                }
              )
                .then(async() => {
                  await shiftWorkDelete(row._id)
                  this.getListShiftWorkByRule()
                  this.updateRuleItem()
                  this.$message({
                    type: pixelConstants.SUCCESS_MESSAGE_TYPE,
                    message: this.$t('common.deleteSucced')
                  })
                })
                .catch(err => {
                  console.error(err)
                })
            }
          })
        }
      })
    },
    deletePriority(row) {
      this.$confirm(
        this.$t('common.removePriorities'),
        this.$t('common.deletePriorities'),
        {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: pixelConstants.WARNING_MESSAGE_TYPE
        }
      )
        .then(async() => {
          await priorityDelete(row._id)
          this.getPriorityByRule()
          this.updateRuleItem()
          this.$message({
            type: pixelConstants.SUCCESS_MESSAGE_TYPE,
            message: this.$t('common.deleteSucced')
          })
        })
        .catch(err => {
          console.error(err)
        })
    },
    addCargoCategory() {
      // Debo comprobar antes si hay una SupplierChain dada de alta.
      if (this.supplierChainList.length > 0) {
        this.dialogTitleCargoCategory = this.$t('rules.createCargoesCategory')
        this.dialogFormCargoCategoryVisible = true
        this.listPreference = []
        this.resetdataFormCargoCategory()
        this.resetdataFormPreference()
        this.resetdataFormRange()
        this.$nextTick(() => {
          this.$refs['refDataFormCargoCategory'].clearValidate()
        // this.$refs.name.focus()// Put focus over the first input control
        })
      } else {
        this.$message({
          type: pixelConstants.ERROR_MESSAGE_TYPE,
          message: this.$t('common.mustExistSupplierChain')
        })
      }
    },
    addShiftWork() {
      this.resetdataFormShiftWork()
      this.dialogTitleShiftWork = this.$t('rules.createShiftWork')
      this.dialogFormShiftWorkVisible = true
      this.$nextTick(() => {
        this.$refs['refDataFormShiftWork'].clearValidate()
        // this.$refs.name.focus()// Put focus over the first input control
      })
    },
    addPriority() {
      console.log('addPriority')
      console.log(this.listCargoCategory.length)
      if (this.listCargoCategory.length === 0) {
        this.$message({
          type: pixelConstants.WARNING_MESSAGE_TYPE,
          message: this.$t('common.noCargoCategoriesCreated')
        })
        setTimeout(() => {
          this.resetdataFormPriority()
          this.resetdataFormSelectedPriority()
          this.dialogFormPriorityVisible = true
          this.dialogTitlePriority = this.$t('rules.addPriority')
          this.$nextTick(() => {
            this.$refs['refDataFormPriority'].clearValidate()
          })
        }, 2 * 1000)
      } else {
        this.resetdataFormPriority()
        this.resetdataFormSelectedPriority()
        this.dialogFormPriorityVisible = true
        this.dialogTitlePriority = this.$t('rules.addPriority')
        this.$nextTick(() => {
          this.$refs['refDataFormPriority'].clearValidate()
        })
      }
    },
    resetdataFormCargoCategory() {
      this.dataFormCargoCategory = {
        idCargoCategory: '',
        idRule: null,
        segment: '',
        unit: '',
        typical_amount_range: [],
        assignation_preference: {
          priority: '',
          direction: '',
          dock_ID: '',
          supply_chain_ID: ''
        }
      }
      this.active = 0
    },
    resetdataFormRange() {
      this.dataFormRange = {
        lower: 0,
        upper: 0
      }
    },
    resetdataFormShiftWork() {
      this.dataFormShiftWork = {
        _id: '',
        idRule: '',
        idShiftWork: '',
        value: [
          {
            day: 'Monday',
            startFirstShift: '',
            endFirstShift: '',
            startSecondShift: '',
            endSecondShift: ''
          },
          {
            day: 'Tuesday',
            startFirstShift: '',
            endFirstShift: '',
            startSecondShift: '',
            endSecondShift: ''
          },
          {
            day: 'Wednesday',
            startFirstShift: '',
            endFirstShift: '',
            startSecondShift: '',
            endSecondShift: ''
          },
          {
            day: 'Thursday',
            startFirstShift: '',
            endFirstShift: '',
            startSecondShift: '',
            endSecondShift: ''
          },
          {
            day: 'Friday',
            startFirstShift: '',
            endFirstShift: '',
            startSecondShift: '',
            endSecondShift: ''
          },
          {
            day: 'Saturday',
            startFirstShift: '',
            endFirstShift: '',
            startSecondShift: '',
            endSecondShift: ''
          },
          {
            day: 'Sunday',
            startFirstShift: '',
            endFirstShift: '',
            startSecondShift: '',
            endSecondShift: ''
          }
        ]
      }
    },
    resetdataFormPriority() {
      this.dataFormPriority = {
        _id: '',
        idRule: '',
        priority: []
      }
    },
    resetdataFormSelectedPriority() {
      this.dataFormSelectedPriority = {
        priority: []
      }
    },
    resetdataFormPreference() {
      this.dataFormPreference = {
        priority: this.getNextAvailablePreference,
        direction: '',
        dock_ID: '',
        supply_chain_ID: ''
      }
    },
    cancelPreference() {
      this.$refs['refDataFormPreference'].clearValidate()
      this.resetdataFormPreference()
      // this.dataFormPreference.priority = ''
      // this.dataFormPreference.direction = ''
      // this.dataFormPreference.dock_ID = ''
      // this.dataFormPreference.supply_chain_ID = ''
      this.editPreference = false
    },
    editCargoCategory(row) {
      this.dialogTitleCargoCategory = this.$t('rules.editCargoesCategory')
      console.log(row)
      // we need to deep copy the value of "row" into "dataFormCargoCategory"
      this.dataFormCargoCategory = JSON.parse(JSON.stringify(row)) // deep copy
      // this.listPreference = [...row.assignation_preference] // shallow copy
      this.listPreference = JSON.parse(JSON.stringify(row.assignation_preference)) // deep copy
      // this.listRange = [...row.typical_amount_range]
      this.dataFormRange.lower = row.typical_amount_range[0]
      this.dataFormRange.upper = row.typical_amount_range[1]
      this.dialogFormCargoCategoryVisible = true
      this.resetdataFormPreference()
      // this.oldList = this.listPreference.map(v => v.priority)
      // this.newList = this.oldList.slice()
      this.$nextTick(() => {
        this.$refs['refDataFormCargoCategory'].clearValidate()
        // this.setSort()
      })
    },
    setSort() {
      // Function to control drag&drop. At the moment it is not invoked
      console.log(this.$refs)
      console.log(this.$refs.dragTable)
      const el = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        setData: function(dataTransfer) {
          // to avoid Firefox bug
          // Detail see : https://github.com/RubaXa/Sortable/issues/1012
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const targetRow = this.listPreference.splice(evt.oldIndex, 1)[0]
          this.listPreference.splice(evt.newIndex, 0, targetRow)
          // for show the changes, you can delete in you code
          const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
          this.newList.splice(evt.newIndex, 0, tempIndex)
        }
      })
      console.log(this.sortable)
    },
    editItemPreference(rowPreference) {
      this.indexPreference = this.listPreference.indexOf(rowPreference)
      this.dataFormPreference = Object.assign({}, rowPreference) // copy object
      this.editPreference = true
    },
    sortPriorityTable() {
      // sorting the list of preferences and then matching indexes with priorities from 1 upwards
      return this.listPreference
        .sort((a, b) => a.priority - b.priority)
        .map((item, index) => { item.priority = index + 1 })
    },
    deleteItemPreference(rowPreference) {
      const indexToDelete = this.listPreference.indexOf(rowPreference)
      this.listPreference.splice(indexToDelete, 1)
      this.sortPriorityTable()
      this.resetdataFormPreference()
    },
    updatePreference() {
      this.$refs['refDataFormPreference'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.dataFormPreference)
          this.listPreference[this.indexPreference].priority = tempData.priority
          this.listPreference[this.indexPreference].direction = tempData.direction
          this.listPreference[this.indexPreference].dock_ID = tempData.dock_ID
          this.listPreference[this.indexPreference].supply_chain_ID = tempData.supply_chain_ID
          this.cancelPreference()
          // this.sortPriorityTable()
        }
      })
    },
    addPreference() {
      const priorityTaken = this.listPreference.some(item => item.priority === this.dataFormPreference.priority)
      if (priorityTaken) {
        this.$message({
          type: pixelConstants.ERROR_MESSAGE_TYPE,
          message: this.$t('rules.priorityTaken')
        })
      } else {
        this.$refs['refDataFormPreference'].validate(valid => {
          if (valid) {
            const tempData = Object.assign({}, this.dataFormPreference)
            this.listPreference.push(tempData)
            this.cancelPreference()
            // this.sortPriorityTable()
          }
        })
      }
    },
    editShiftWork(row) {
      this.dialogTitleShiftWork = this.$t('rules.editShiftWork')
      console.log(row)
      this.dialogFormShiftWorkVisible = true
      // we need to deep copy the value of "row" into "dataFormCargoCategory"
      this.dataFormShiftWork = JSON.parse(JSON.stringify(row)) // deep copy
      this.$nextTick(() => {
        this.$refs['refDataFormShiftWork'].clearValidate()
      })
    },
    getSelectedPriorities(row) {
      const selectedPriorities = []
      row.priority
        .forEach(priorityName => {
          const priorityAvailable = this.listAvailablePriorities.find(item => item.label === priorityName)
          if (priorityAvailable) {
            selectedPriorities.push(priorityAvailable.key)
          }
        })
      console.log(selectedPriorities)
      return selectedPriorities
    },
    editPriority(row) {
      // console.log(row)
      this.dialogFormPriorityVisible = true
      this.dialogTitlePriority = this.$t('rules.choosePriorities')
      this.dataFormPriority._id = row._id
      // setting an array where to store our selection of Priorities (dataFormPriority.priority) as indexes (i.e.[0, 1, 4])
      this.dataFormSelectedPriority.priority = this.getSelectedPriorities(row)
      this.$nextTick(() => {
        this.$refs['refDataFormPriority'].clearValidate()
      })
    },
    preValidateNameCargoCategory(formName) {
      var name = this.dataFormCargoCategory.idCargoCategory
      var createNewCargoCategory = true
      cargoCategoryFetchList(this.listQuery).then(response => {
        var listCargoCategory = response.data
        if (listCargoCategory.length > 0) {
          // Compruebo los nombres para evitar repetidos
          listCargoCategory.forEach(cargo => {
            if (cargo.idCargoCategory === name) {
              createNewCargoCategory = false
            }
          })
          if (createNewCargoCategory) {
            // Procedo a crear el nuevo area
            this.createCargoCategory(formName)
          } else {
            // Mensaje indicando que debe de cambiar el nombre asignado al cargo category
            this.$message({
              type: pixelConstants.ERROR_MESSAGE_TYPE,
              message: this.$t('common.noValidNameForCargoCategory')
            })
            console.log('Existe un cargo con ese nombre por favor cambie el nombre')
          }
        } else {
          // Creo el cargo category
          this.createCargoCategory(formName)
        }
      })
    },
    preValidateNameShiftWork(formName) {
      var name = this.dataFormShiftWork.idShiftWork
      var createNewShiftWork = true
      shiftWorkFetchList(this.listQuery).then(response => {
        var listShiftWork = response.data
        if (listShiftWork.length > 0) {
          // Compruebo los nombres para evitar repetidos
          listShiftWork.forEach(shift => {
            if (shift.idShiftWork === name) {
              createNewShiftWork = false
            }
          })
          if (createNewShiftWork) {
            // Procedo a crear el nuevo area
            this.createShiftWork(formName)
          } else {
            // Mensaje indicando que debe de cambiar el nombre asignado al cargo category
            this.$message({
              type: pixelConstants.ERROR_MESSAGE_TYPE,
              message: this.$t('common.noValidNameForShiftWork')
            })
            console.log('Existe un cargo con ese nombre por favor cambie el nombre')
          }
        } else {
          // Creo el cargo category
          this.createShiftWork(formName)
        }
      })
    },
    createCargoCategory(formName) {
      if (this.dataFormRange.upper >= this.dataFormRange.lower) {
        this.$refs['refDataFormRange'].validate(valid => {
          if (valid) {
            console.log('CREATE ONE CARGOES CATEGORY')
            this.$refs[formName].validate(valid => {
              if (valid) {
              // console.log('Create one Cargoes Category')
                this.dataFormCargoCategory.idRule = this.idRule
                this.dataFormCargoCategory.typical_amount_range = [this.dataFormRange.lower, this.dataFormRange.upper]
                this.dataFormCargoCategory.assignation_preference = this.listPreference
                console.log(this.dataFormCargoCategory)
                cargoCategoryCreate(this.dataFormCargoCategory).then(response => {
                  this.dialogFormCargoCategoryVisible = false
                  this.$notify({
                    title: this.$t('common.success'),
                    message: this.$t('common.createdSuccessfully'),
                    type: 'success',
                    duration: 2000
                  })
                  this.getListCargoCategoryByRule()
                  this.updateRuleItem()
                  this.listPreference = null
                  this.active = 0
                })
              }
            })
          }
        })
      } else {
        this.$message({
          type: pixelConstants.ERROR_MESSAGE_TYPE,
          message: this.$t('common.lowerLimitBiggerThanUpperLimit')
        })
      }
    },
    createShiftWork(formName) {
      console.log('CREATE ONE SHIFT WORK')
      this.$refs[formName].validate(valid => {
        if (valid) {
          // console.log('Create one Shift Work')
          // console.log(this.dataFormShiftWork)
          const arrayDataFormShiftWork = [this.dataFormShiftWork]
          const arrayShiftWorkInServerFormat = this.shiftWorkToServer(arrayDataFormShiftWork)
          arrayShiftWorkInServerFormat[0].idRule = this.idRule
          console.log(arrayShiftWorkInServerFormat[0])
          shiftWorkCreate(arrayShiftWorkInServerFormat[0]).then(response => {
            this.dialogFormShiftWorkVisible = false
            this.$notify({
              title: this.$t('common.success'),
              message: this.$t('common.createdSuccessfully'),
              type: 'success',
              duration: 2000
            })
            this.getListShiftWorkByRule()
            this.updateRuleItem()
            this.active = 0
          })
        }
      })
    },
    createPriority(formName) {
      console.log('CREATE PRIORITY')
      this.$refs[formName].validate(valid => {
        if (valid) {
          // preparar los datos que se le van a pasar a "prioirityCreate()"
          this.dataFormPriority.idRule = this.idRule
          this.dataFormPriority.priority = this.dataFormSelectedPriority.priority.map(item => this.listAvailablePriorities[item].label)
          priorityCreate(this.dataFormPriority).then(response => {
            this.dialogFormPriorityVisible = false
            this.$notify({
              title: this.$t('common.success'),
              message: this.$t('common.createdSuccessfully'),
              type: 'success',
              duration: 2000
            })
            this.getPriorityByRule()
            this.updateRuleItem()
          })
        }
      })
    },
    updateRuleItem() {
      // Recupero el recurso por su ID
      ruleGet(this.idRule)
        .then(response => {
          var rule = response.data
          rule.exportToIH_pending = true
          ruleUpdate(this.idRule, rule)
            .then(response => {
              console.log('RULE UPDATED')
            })
            .catch(err => {
              console.error(err)
            })
        })
        .catch(() => {
          console.log('Error')
        })
    },
    updateCargoCategory() {
      if (this.dataFormRange.upper >= this.dataFormRange.lower) {
        this.$refs['refDataFormRange'].validate(valid => {
          if (valid) {
            console.log('UPDATE CARGO CATEGORY')
            this.$refs['refDataFormCargoCategory'].validate(valid => {
              if (valid) {
                this.dataFormCargoCategory.typical_amount_range = [this.dataFormRange.lower, this.dataFormRange.upper]
                this.dataFormCargoCategory.assignation_preference = this.listPreference
                console.log(this.dataFormCargoCategory)
                cargoCategoryUpdate(this.dataFormCargoCategory._id, this.dataFormCargoCategory)
                  .then(response => {
                    this.dialogFormCargoCategoryVisible = false
                    this.$notify({
                      title: this.$t('common.success'),
                      message: this.$t('common.updateSuccessfull'),
                      type: 'success',
                      duration: 2000
                    })
                    this.getListCargoCategoryByRule()
                    this.updateRuleItem()
                    this.active = 0
                  })
                  .catch(() => {
                    console.log('Error')
                  })
              }
            })
          }
        })
      } else {
        this.$message({
          type: pixelConstants.ERROR_MESSAGE_TYPE,
          message: this.$t('common.lowerLimitBiggerThanUpperLimit')
        })
      }
    },
    updateShiftWork() {
      console.log('UPDATE SHIFT WORK')
      this.$refs['refDataFormShiftWork'].validate(valid => {
        if (valid) {
          // console.log(this.dataFormShiftWork)
          const arrayDataFormShiftWork = [this.dataFormShiftWork]
          const arrayShiftWorkInServerFormat = this.shiftWorkToServer(arrayDataFormShiftWork)
          shiftWorkUpdate(arrayShiftWorkInServerFormat[0]._id, arrayShiftWorkInServerFormat[0])
            .then(response => {
              this.dialogFormShiftWorkVisible = false
              this.$notify({
                title: this.$t('common.success'),
                message: this.$t('common.updateSuccessfull'),
                type: 'success',
                duration: 2000
              })
              this.getListShiftWorkByRule()
              this.updateRuleItem()
              this.active = 0
            })
            .catch(() => {
              console.log('Error')
            })
        }
      })
    },
    updatePriority() {
      this.$refs['refDataFormPriority'].validate(valid => {
        if (valid) {
          console.log('UPDATE PRIORITY...')
          this.dataFormPriority.idRule = this.idRule
          this.dataFormPriority.priority = this.dataFormSelectedPriority.priority.map(item => this.listAvailablePriorities[item].label)
          console.log(this.dataFormPriority.priority)
          this.priorityUpdate_Request(this.dataFormPriority._id, this.dataFormPriority)
        }
      })
    },
    updatePriorityWhenCargoCategoryIsDeleted(deletedCargoCategoryName) {
      // console.log(deletedCargoCategoryName)
      // console.log(this.listPriority)
      if (this.listPriority.length > 0) {
        this.listPriority.forEach(item => {
          const indexToDelete = item.priority.indexOf(deletedCargoCategoryName)
          // console.log('Item.priority: ', item.priority)
          // console.log('IndexToDelete: ', indexToDelete)
          if (indexToDelete >= 0) {
            this.dataFormPriority.idRule = item.idRule
            this.dataFormPriority._id = item._id
            this.dataFormPriority.priority = [...item.priority] // copy the array
            this.dataFormPriority.priority.splice(indexToDelete, 1)
            // console.log('DATAFORMPRIORITY...')
            // console.log(this.dataFormPriority)
            // update request to the server here...
            this.priorityUpdate_Request(this.dataFormPriority._id, this.dataFormPriority)
          }
        })
      }
    },
    priorityUpdate_Request(id, body) {
      priorityUpdate(id, body)
        .then(response => {
          this.dialogFormPriorityVisible = false
          this.$notify({
            title: this.$t('common.success'),
            message: this.$t('common.updateSuccessfull'),
            type: 'success',
            duration: 2000
          })
          this.getPriorityByRule()
          this.updateRuleItem()
        })
    }
  }
}
</script>

<style>
.sortable-ghost{
  opacity: .8;
  color: #fff!important;
  background: #42b983!important;
}
</style>

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
.rules-subheader {
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
.icon-star{
  margin-right:2px;
}
.drag-handler{
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.show-d {
  margin-top: 15px;
}
</style>
