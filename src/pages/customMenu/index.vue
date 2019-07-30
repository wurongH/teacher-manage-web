<template>
  <div class="customMenu">
    <el-button type="primary" @click="addNoe">新增一级菜单</el-button>
    <div class="menu-view">
      <el-tree
        :data="data"
        :props="defaultProps"
        show-checkbox
        node-key="id"
        :highlight-current="true"
        :expand-on-click-node="false"
        default-expand-all
        :accordion="false"
        :render-content="renderContent">
      </el-tree>
    </div>

    <el-dialog :title="text" :visible.sync="dialogFormVisible" width="500px" @close="dialogClose">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item label="菜单名称:" prop="menuName">
          <el-input v-model="form.menuName" auto-complete="off" placeholder="请输入菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="icon名称:" prop="iconName" v-if="this.text.indexOf('二') < 0">
          <el-input v-model="form.iconName" auto-complete="off" placeholder="请输入icon名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  let id = 1000;
  export default {
    name: 'customMenu',
    data() {

      return {
        dialogFormVisible: false,
        text: '',
        editId: '',
        form: {
          menuName: '',
          iconName: '',
        },
        rules: {
          menuName: [
            { required: true, message: '请输入菜单名称', trigger: 'blur' },
          ],
          iconName: [
            { required: true, message: '请输入icon名称', trigger: 'blur' },
          ],
        },
        data: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },

    methods: {
      dialogClose(){
        setTimeout(_ =>{
          this.form = {
            menuName: '',
            iconName: '',
          }
        }, 500)
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.text.indexOf('编辑') != -1){
              this.data.map(v =>{
                if(v.id == this.editId){
                  v.label = this.form.menuName
                  v.icon = this.form.icon
                }else{
                  v.children.map(d =>{
                    d.id == this.editId && (d.label = this.form.menuName);
                  })
                }
              })
            }else if(this.text.indexOf('新增二级') != -1){
              this.data.map(v =>{
                if(v.id == this.editId){
                  v.children.push({
                    id: new Date().getTime(),
                    label: this.form.menuName,
                  })
                }
              })
            }else{
              this.data.push({
                id: new Date().getTime(),
                label: this.form.menuName,
                isNoe: true,
                icon: this.form.iconName,
                children: []
              })
            }

            this.dialogFormVisible = false;
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      append(data) {
        console.log(data);
        this.text = '新增二级菜单'
        this.editId = data.id;
        this.dialogFormVisible = true;
        // const newChild = { id: id++, label: 'testtest', children: [] };
        // if (!data.children) {
        //   this.$set(data, 'children', []);
        // }
        // data.children.push(newChild);
      },
      addNoe(){
        // this.data.push({
        //   id: new Date().getTime(),
        //   label: '一级菜单' + (this.data.length + 1),
        //   isNoe: true,
        //   children: []
        // })
        this.text = '新增一级菜单'
        this.dialogFormVisible = true;
      },

      remove(node, data) {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
      },
      edit(data){
        if(data.isNoe){
          this.text = '编辑一级菜单'
          this.form.iconName = data.icon;
        }else{
          this.text = '编辑二级菜单'
        }
        this.editId = data.id;
        this.form.menuName = data.label;
        this.dialogFormVisible = true;
        console.log(data);
      },

      renderContent(h, { node, data, store }) {
        return (
          <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
            <span>
              {
                data.isNoe && (<span class={ `icon iconfont ${data.icon}` }></span>)
              }
              <span>{node.label}</span>
            </span>
            <span>
              {
                  data.isNoe ? (<el-button style="font-size: 12px;" type="text" on-click={ () => this.append(data) }>新增</el-button>) : ''
              }
              <el-button style="font-size: 12px;" type="text" on-click={ () => this.edit(data) }>编辑</el-button>
              <el-button style="font-size: 12px;" type="text" on-click={ () => this.remove(node, data) }>删除</el-button>
            </span>
          </span>);
      }
    }
  }
</script>

<style lang="scss">
  .customMenu{
    
  }
  .menu-view{
    width: 500px;
  }
  .add-menu-dialog{
    width: 500px;
  }
</style>
