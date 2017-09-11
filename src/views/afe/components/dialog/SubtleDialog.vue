<template>
    <el-dialog
            :title="dialogTitle"
            :visible.sync="dialogFormVisible"
            :before-close="handleClose"
    >
        <el-form>
            <el-form-item label="是否开启">
                <el-cascader :options="start" v-model="isStart">{{isStart[0]}}</el-cascader>
            </el-form-item>
            <el-table
                    :data="tableData"
                    contenteditable="true"
                    max-height="200"
                    onselect="true"
                    ref="singleTable"
                    border
                    highlight-current-row
                    @current-change="handleCurrentChange"
                    @cell-mouse-leave="handleCurrentValue">
                <el-table-column
                        prop="subtleField"
                        label="敏感字段">
                </el-table-column>
            </el-table>
            <el-button-group align="left" style="margin-top: 10px">
                <el-button size="small" @click="addItem">添加</el-button>
                <el-button size="small" @click="deleteItem">删除</el-button>
            </el-button-group>
        </el-form>

        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleOk()">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
  export default {
    data () {
      return {
        dialogTitle: '设置敏感字段',
        dialogFormVisible: true,
        start: [
          {
            label: '是',
            value: 'true'
          },
          {
            label: '否',
            value: 'false',
          }],
        tableData: [],
        //value
        isStart: [],
        currentRow: null
      }
    },
    components: {},
    methods: {
      handleClose (done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done()
          })
          .catch(_ => {})
      },
      addItem () {
        var subtleField = 'default'
        var newItem = {subtleField}
        this.tableData.push(newItem)
      },
      deleteItem () {
        for (var index in this.tableData) {
          var data = this.tableData[index]
          if (data.subtleField === this.currentRow.subtleField) {
            this.tableData.splice(index, 1)
          }
        }
      },
      handleCurrentChange (val) {
        this.currentRow = val
      },
      handleCurrentValue (row, column, cell, event) {
        row.subtleField = cell.textContent
      },
      handleOk () {
        this.dialogFormVisible = false
        IDE.socket.emit('commitSubtleFields', {
          type: IDE.type,
          event: 'commitSubtleFields',
          data: {openable: this.isStart[0], subtleFields: this.tableData}
        }, function (data) {
          if (data) {
            var result = JSON.parse(data)
            if(result.state !== 'success'){
              console.log(result.data.errorMsg)
            }
          }
        })
      }
    }
  }
</script>
