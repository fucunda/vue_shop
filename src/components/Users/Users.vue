<template>
    <div>
        <!-- 1.面包屑区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 2.卡片视图区 -->
        <el-card>
            <!-- 2.1 用户搜索区域 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input
                        placeholder="请输入内容"
                        v-model="queryInfo.query"
                        clearable
                        @clear="getUserList"
                    >
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <!-- 2.2 添加用户区域 -->
                    <el-button type="primary" @click="addUserVisible=true">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 2.3用户列表区 -->
            <el-table :data="userList" stripe border>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="username" label="姓名"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="mobile" label="电话"></el-table-column>
                <el-table-column prop="role_name" label="角色"></el-table-column>
                <el-table-column prop="mg_state" label="状态">
                    <template scope="scope">
                        <el-switch v-model="scope.row.mg_state" @change="userChange(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column prop label="操作" width="180px">
                    <template scope="scope">
                        <!-- //用户修改按钮 -->
                        <el-button
                            type="primary"
                            icon="el-icon-edit"
                            size="mini"
                            @click="showDialogisble(scope.row.id)"
                        ></el-button>
                        <!-- //用户删除按钮 -->
                        <el-button
                            type="danger"
                            icon="el-icon-delete"
                            size="mini"
                            @click="removeUser(scope.row.id)"
                        ></el-button>
                        <!-- 用户设置按钮 -->
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 2.4用户底部页面 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 2, 5, 10]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            ></el-pagination>
        </el-card>

        <!-- 添加用户的提示对话框 -->
        <el-dialog title="添加用户" :visible.sync="addUserVisible" width="50%" @close="addDialogClosed">
            <!-- 内容主体 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- 内容底部 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addUserVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改用户信息的对话框 -->
        <el-dialog
            title="修改用户信息"
            :visible.sync="EditDialogVisible"
            width="50%"
            @close="editReplace"
        >
            <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="100px">
                <el-form-item label="用户名">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="EditDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="EditUsers">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'Users',
    data() {
        //1.验证邮箱的规则
        var checkEmail = (rule, value, cb) => {
            //验证邮箱的正则表达式
            const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
            if (regEmail.test(value)) {
                //合法的邮箱
                return cb()
            }
            cb(new Error('请输入合法的邮箱！！！'))
        }
        //2.验证手机的规则
        var checkMobile = (rule, value, cb) => {
            //验证手机的正则表达式
            const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
            if (regMobile.test(value)) {
                //合法的手机
                return cb()
            }
            cb(new Error('请输入合法的手机号！！！'))
        }
        return {
            queryInfo: {
                query: '',
                // 当前页码
                pagenum: 1,
                //一页显示多少条数据
                pagesize: 2,
            },
            userList: [],
            total: 0,
            //控制添加对话框的显示与隐藏
            addUserVisible: false,
            // 添加用户表单数据
            addForm: {
                username: '',
                password: '',
                email: '',
                mobile: '',
            },
            //添加用户表单规则
            addFormRules: {
                username: [
                    {
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur',
                    },
                    {
                        min: 3,
                        max: 8,
                        message: '长度在 3 到 8 个字符',
                        trigger: 'blur',
                    },
                ],
                //校验密码输入框里的数据
                password: [
                    {
                        required: true,
                        message: '请输入用户密码',
                        trigger: 'blur',
                    },
                    {
                        min: 6,
                        max: 10,
                        message: '长度在 6 到 10 个字符',
                        trigger: 'blur',
                    },
                ],
                email: [
                    {
                        required: true,
                        message: '请输入邮箱',
                        trigger: 'blur',
                    },
                    {
                        validator: checkEmail,
                        trigger: 'blur',
                    },
                ],
                mobile: [
                    {
                        required: true,
                        message: '请输入手机号码',
                        trigger: 'blur',
                    },
                    {
                        validator: checkMobile,
                        trigger: 'blur',
                    },
                ],
            },
            //控制修改用户的对话框
            EditDialogVisible: false,
            //查询到的用户信息
            editForm: {},
            //修改用户规则
            /*  editFormRules: {
                username: [
                    {
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur',
                    },
                    {
                        min: 3,
                        max: 8,
                        message: '长度在 3 到 8 个字符',
                        trigger: 'blur',
                    },
                ],
                email: [
                    {
                        required: true,
                        message: '请输入邮箱',
                        trigger: 'blur',
                    },
                    {
                        validator: checkEmail,
                        trigger: 'blur',
                    },
                ],
                mobile: [
                    {
                        required: true,
                        message: '请输入手机号码',
                        trigger: 'blur',
                    },
                    {
                        validator: checkMobile,
                        trigger: 'blur',
                    },
                ],
            }, */
        }
    },
    created() {
        this.getUserList()
    },
    methods: {
        // 获取用户列表
        async getUserList() {
            const { data: res } = await this.$http.get('users', {
                params: this.queryInfo,
            })
            // console.log(res)
            if (res.meta.status !== 200)
                return this.$message.error('获取用户列表错误')
            this.userList = res.data.users
            this.total = res.data.total
        },
        //1.一页显示多少条
        handleSizeChange(newPage) {
            // console.log(newPage)
            // console.log(this.queryInfo)
            this.queryInfo.pagesize = newPage
            this.getUserList()
        },
        // 当前页码大小
        handleCurrentChange(page) {
            // console.log('$$', page)
            this.queryInfo.pagenum = page
            // 赋值之后还要重新获取数据
            this.getUserList()
        },

        // 更新用户状态
        async userChange(userinfo) {
            console.log(userinfo)
            const { data: res } = await this.$http.put(
                `users/${userinfo.id}/state/${userinfo.mg_state}`
            )
            if (res.meta.status !== 200) {
                userinfom.mg_state = !userinfo.mg_state
                return this.$message.error('更改用户状态失败!')
            }
            this.$message.success('更新用户状态成功！')
        },
        //监听添加用户对话框关闭的重置事件
        addDialogClosed() {
            this.$refs.addFormRef.resetFields()
        },
        //添加新用户的表单验证
        addUser() {
            this.$refs.addFormRef.validate(async (valid) => {
                if (!valid) return
                //验证通过，可以发起网络请求，添加新用户
                const { data: res } = await this.$http.post(
                    'users',
                    this.addForm
                )
                if (res.meta.status !== 201) {
                    this.$message.error('添加用户失败')
                }
                this.$message.success('添加用户成功')
                //隐藏对话框
                this.addUserVisible = false
                //更新用户列表
                this.getUserList()
            })
        },

        //修改用户信息
        async showDialogisble(id) {
            //发起请求
            const { data: res } = await this.$http.get('users/' + id)
            if (res.meta.status !== 200) {
                return this.$message.error('获取用户信息失败')
            }
            this.editForm = res.data
            // console.log(res.data)
            // console.log(this.editForm)

            this.EditDialogVisible = true
        },
        //点击取消按钮之后对话框的重置操作
        editReplace() {
            // this.$refs.addFormRef.resetFields()
            this.$refs.editFormRef.resetFields()
        },
        //提交修改用户信息之前进行预校验
        EditUsers() {
            this.$refs.editFormRef.validate(async (valid) => {
                // console.log(valid)
                if (!valid) return
                //验证通过，可以发起网络请求，添加新用户
                const { data: res } = await this.$http.put(
                    'users/' + this.editForm.id,
                    { email: this.editForm.email, mobile: this.editForm.mobile }
                )
                if (res.meta.status !== 200) {
                    return this.$message.error('更新用户失败')
                }
                //更新用户列表
                this.getUserList()
                //提示用户更新成功
                this.$message.success('更新用户成功')
                //隐藏对话框
                this.EditDialogVisible = false
            })
        },

        // 根据用户id进行删除用户操作
        async removeUser(id) {
            // console.log(id)
            const confirmInfo = await this.$confirm(
                '此操作将永久删除该用户, 是否继续?',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            ).catch((err) => err)
            //如果用户确认删除，返回confirm字符串
            //如果用户确认删除，返回canel字符串
            if (confirmInfo !== 'confirm') {
                this.$message.info('用户取消删除')
            }
            // console.log('确认删除')
            const { data: res } = await this.$http.delete('users/' + id)
            if (res.meta.status !== 200) {
                return this.$message.error('删除用户失败')
            }
            this.$message.success('删除用户成功')
            this.getUserList()
        },
    },
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
    margin-bottom: 15px;
}
</style>