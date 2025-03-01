<template>
    <PrimeDialog v-model:visible="dataSetCreateDialogVisible" modal header="Create new dataset" :style="{ width: '25rem' }" :closable="false">
        <PrimeForm v-slot="$form" :initialValues :resolver="resolver" @submit="onSubmit">
            <div class="flex flex-col gap-2 mb-8">
                <div class="flex flex-col gap-1">
                    <PrimeInputText name="name" type="text" placeholder="Name" fluid :disabled="isLoading"/>
                    <PrimeMessage v-if="$form.name?.invalid" severity="error" size="small" variant="simple">{{ $form.name.error.message }}</PrimeMessage>
                    <div v-else>&nbsp;</div>
                </div>
                <div>
                    <PrimeTextarea 
                        name="description" placeholder="Description" 
                        class="w-full"
                        rows="6" style="resize: none"
                        :disabled="isLoading"
                    />
                </div>
            </div>
            <div class="flex justify-between items-center gap-2">
                <div>
                    <i v-if="isLoading" class="pi pi-spin pi-spinner text-yellow-300" style="font-size: 2.3rem"></i>
                </div>
                <div class="flex gap-2">
                    <PrimeToast />
                    <PrimeButton type="button" label="Cancel" severity="secondary" @click="close" :disabled="isLoading"></PrimeButton>
                    <PrimeButton type="submit" label="Create" severity="success" :disabled="isLoading"></PrimeButton>
                </div>
            </div>
        </PrimeForm>
    </PrimeDialog>
</template>

<script>

import { mapState } from "pinia";
import useDialogStore from "@/stores/dialog";
import useDataSetStore from "@/stores/dataSet";

import { yupResolver } from "@primevue/forms/resolvers/yup";
import * as yup from "yup";

export default {
    name: "AppDataSetCreateDialog",
    components: { },
    data() {
        return { 
            isLoading: false,
            initialValues: {
                name: "",
                description: ""
            },
            resolver: yupResolver(
                yup.object().shape({
                    name: yup.string()
                            .required("Name is required!")
                            .min(2, "Name must have at least 2 characters1"),
                    description: yup.string()
                })
            )
        }
    },
    computed: {
        ...mapState(useDialogStore, ["dataSetCreateDialogVisible"])
    },
    emits: ["createdDataSet"],
    methods: {
        async onSubmit({ valid, values }) {
            try {
                this.isLoading = true;
                if(valid) {
                    this.$toast.add({ severity: "info", summary: "Request has been sent", detail: "The dataset is being created...", life: 1500 });

                    const dataSetStore = useDataSetStore();
                    const createDataSetResult = await dataSetStore.createDataSet(values);

                    if(createDataSetResult?.success) {
                        this.close();
                        this.$emit("createdDataSet")
                    } else {
                        this.$toast.add({ severity: "error", summary: "Error", detail: createDataSetResult.message ?? "Something went wrong!" , life: 3000 });
                    }
                }
            } catch (error) {
                this.$toast.add({ severity: "error", summary: "Error", detail: "Something went wrong!" , life: 3000 });
            } finally {
                this.isLoading = false;
            }
        },
        close() {
            const dialogStore = useDialogStore();
            dialogStore.hideDataSetCreateDialog();
        }
    }
}

</script>

<style lang="scss" scoped>

</style>