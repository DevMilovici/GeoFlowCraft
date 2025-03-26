<template>
    <PrimeDialog v-model:visible="confirmDialogVisible" modal :header="confirmDialogInfo?.title" :closable="false">
        <div class="mt-2 mb-4">
            {{ confirmDialogInfo.message }}
        </div>
        <div class="flex justify-between">
            <PrimeButton label="No" icon="pi pi-times" severity="info" @click="cancel"/>
            <div>
                <i v-show="confirmDialogIsLoading" class="pi pi-spin pi-spinner text-yellow-300" style="font-size: 2.3rem"></i>
            </div>
            <PrimeButton label="Yes" icon="pi pi-check" severity="danger" @click="confirm" />
        </div>
    </PrimeDialog>
</template>

<script>
import { mapState } from 'pinia';
import useDialogStore from "@/stores/dialog";

export default {
    name: "AppConfirmDialog",
    components: {},
    data() {
        return {

        }
    },
    computed: {
        ...mapState(useDialogStore, ["confirmDialogVisible", "confirmDialogInfo", "confirmDialogIsLoading"]),
    },
    emits: ["confirmYes", "confirmNo"],
    methods: {
        confirm() {
            this.$emit("confirmYes");
        },
        cancel() {
            this.$emit("confirmNo");
        }
    }
}

</script>