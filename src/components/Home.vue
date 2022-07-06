<template>
    <el-container class="home-container">
        <!-- 1.头部导航栏 -->
        <el-header>
            <div>
                <img src="../assets/home-logo.png" alt />
                <span>电商管理系统</span>
            </div>
            <el-button type="info" @click="logout">登出</el-button>
        </el-header>
        <!--  2.侧边栏 -->
        <el-container>
            <el-aside :width="isSideebars ? '64px':'200px'">
                <div class="toggle-button" @click="foidAide">|||</div>
                <el-menu
                    background-color="#545c64"
                    text-color="#fff"
                    active-text-color="#409eff"
                    unique-opened
                    :collapse="isSideebars"
                    :collapse-transition="false"
                    router
                    :default-active="activePath"
                >
                    <!-- 一级菜单区域 -->
                    <el-submenu :index="item.id+''" v-for="item in metuList" :key="item.id">
                        <template slot="title">
                            <i :class="iconsObj[item.id]" id="icons-i"></i>
                            <span>{{item.authName}}</span>
                        </template>

                        <!-- 二级菜单区域 -->
                        <el-menu-item
                            :index="'/'+subItem.path"
                            v-for="subItem in item.children"
                            :key="subItem.id"
                            @click="saveActive('/'+subItem.path)"
                        >
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{subItem.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 3.主体部分 -->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    name: 'Home',
    data() {
        return {
            metuList: [],
            iconsObj: {
                125: 'iconfont icon-user',
                103: 'iconfont icon-tijikongjian',
                101: 'iconfont icon-shangpin',
                102: 'iconfont icon-danju',
                145: 'iconfont icon-baobiao',
            },
            isSideebars: false,
            activePath: '',
        }
    },
    created() {
        this.getItemList()
        this.activePath = window.sessionStorage.getItem('activePath')
    },
    methods: {
        logout() {
            window.sessionStorage.clear()
            this.$router.push('/login')
        },
        // 获取侧边栏菜单
        async getItemList() {
            const { data: res } = await this.$http.get('menus')
            if (res.meta.status !== 200)
                return this.$message.error(res.meta.msg)
            this.metuList = res.data
            // console.log(res)
        },
        //折叠侧边栏
        foidAide() {
            this.isSideebars = !this.isSideebars
        },
        //使点击二级列表的时候，保存跳转路径，实现页面跳转
        saveActive(activePath) {
            window.sessionStorage.setItem('activePath', activePath)
            this.activePath = activePath
        },
    },
}
</script>

<style lang="less" scoped>
.home-container {
    height: 100%;
}
.el-header {
    background-color: #374147;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 0px;
    color: #fff;
    font-size: 20px;
    > div {
        display: flex;
        align-items: center;
        span {
            margin-left: 15px;
        }
    }
    img {
        width: 61px;
        height: 56px;
        // border-radius: 50%;
    }
}
.el-aside {
    background-color: #333e44;
    .el-menu {
        border-right: none;
    }
}
.main {
    background-color: #eaedf1;
}
#icons-i {
    margin-right: 15px;
}
.toggle-button {
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>