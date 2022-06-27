<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像区域 -->
            <div class="head_box">
                <img src="../assets/logo.jpg" alt />
            </div>
            <!-- 表单区域 -->
            <el-form
                ref="loginFormRef"
                :model="loginForm"
                :rules="loginFormRules"
                label-width="0px"
                class="login_form"
            >
                <!-- 用户区域 -->
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="el-icon-user-solid"></el-input>
                </el-form-item>
                <!-- 密码区域 -->
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" show-password></el-input>
                </el-form-item>
                <!-- 按钮区域 -->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="loginReplace">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import router from '@/router'
export default {
    name: 'Login',
    data() {
        return {
            // 登录表单数据绑定对象
            loginForm: {
                username: 'admin',
                password: '123456',
            },
            // 表单检验绑定的对象
            loginFormRules: {
                //校验用户输入框里的数据
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
            },
        }
    },
    methods: {
        //登录重置方法
        loginReplace() {
            // console.log(this);
            this.$refs.loginFormRef.resetFields()
        },
        //登录校验方法
        login() {
            this.$refs.loginFormRef.validate(async (valit) => {
                if (!valit) return
                const { data: res } = await this.$http.post(
                    'login',
                    this.loginForm
                )
                // console.log(res);
                if (res.meta.status !== 200)
                    return this.$message.error('登录失败！')
                // console.log("登录成功");
                this.$message.success('登录成功！')
                //1.将登录成功之后的token，保存到客户端的sessionStorge中
                //1.1项目中除了登录之外的其他API接口，必须在登录之后才能访问
                //1.2 token只应在当前网站打开期间生效，所以将token保存在sessionStorage中
                window.sessionStorage.setItem('token', res.data.token)
                //2.通过编程式导航跳转到后台主页，路由路径地址是  /home
                this.$router.push('/home')
            })
        },
    },
}
</script>

<style lang="less"  scoped>
.login_container {
    background-color: #2b4b6b;
    height: 100%;
    .login_box {
        background-color: #ffffff;
        width: 450px;
        height: 300px;
        border-radius: 3px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
    }
}

.head_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    box-shadow: 0 0 10px #ddd;
    padding: 10px;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #ffffff;
    img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
    }
}
.login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}
.btns {
    display: flex;
    justify-content: flex-end;
}
</style>