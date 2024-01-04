<template>
    <div>
        <el-card class="box-card">
            <div v-for="o in 4" :key="o" class="text item">
                {{ '列表内容 ' + o }}
            </div>
        </el-card>
    </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
export default {
    // 组件注册
    components: {

    },
    data() {
        return {


        };
    },
    methods: {

    },
    mounted() {

    }
};
</script>
<style scoped >
<style>.text {
    font-size: 14px;
}

.item {
    padding: 18px 0;
}

.box-card {
    width: 480px;
}
</style>