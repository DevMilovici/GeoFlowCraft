<template>
    <PrimeDialog v-model:visible="dataLayerCreateDialogVisible" modal header="Create new datalayer" :style="{ width: '25rem' }" :closable="false">
        <PrimeForm v-slot="$form" :initialValues="initialValues" :resolver="resolver" @submit="onSubmit">
            <div class="flex flex-col gap-2">
                <!-- Name -->
                <div class="flex flex-col gap-1">
                    <PrimeInputText 
                        name="name" placeholder="Name"
                        type="text" fluid 
                        :disabled="isLoading" />
                    <PrimeMessage v-if="$form.name?.invalid" 
                        severity="error" size="small" 
                        variant="simple"
                    >{{ $form.name.error.message }}</PrimeMessage>
                    <div v-else>&nbsp;</div>
                </div>
                <!-- Description -->
                <div>
                    <PrimeTextarea 
                        name="description" placeholder="Description" 
                        class="w-full"
                        rows="6" style="resize: none"
                        :disabled="isLoading"
                    />
                </div>
                <!-- File upload -->
                <div class="flex flex-col gap-1 border border-zinc-600 rounded p-2">
                    <span class="text-gray-400">File source</span>
                    <PrimeFileUpload 
                        ref="fileupload" mode="basic" 
                        name="files[]"
                        @select="onFileSelected($event)" 
                        :disabled="isLoading"
                    />
                    <PrimeIftaLabel>
                        <PrimeInputText
                            v-model="fileType"
                            name="format"
                            type="text" fluid
                            :disabled="true" autocomplete="off"
                        />
                        <label for="name">Format</label>
                    </PrimeIftaLabel>
                </div>
            </div>
            <div class="flex justify-between items-center gap-2 mt-2">
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
        <PrimeToast />
    </PrimeDialog>
</template>

<script>

import { mapState } from 'pinia';
import useDialogStore from "@/stores/dialog";
import useDataSetStore from "@/stores/dataSet";

import { yupResolver } from "@primevue/forms/resolvers/yup";
import * as yup from "yup";

import fileService from '@/services/fileService';

export default {
    name: "AppDataLayerCreateDialog",
    components: {},
    data() {
        return {
            isLoading: false,
            initialValues: {
                name: "",
                description: "",
                format: ""
            },
            fileType: "",
            fileFormat: "",
            file: null,
            resolver: yupResolver(
                yup.object().shape({
                    name: yup.string()
                            .required("Name is required!")
                            .min(2, "Name must have at least 2 characters!"),
                    description: yup.string()
                })
            )
        }
    },
    computed: {
        ...mapState(useDialogStore, ["dataLayerCreateDialogVisible"])
    },
    emits: [],
    methods: {
        async onFileSelected(event) {
            let file = null;
            try {                
                file = event.files[0];

                switch(file.type) {
                    case "image/tiff":
                        this.fileFormat = "tiff/base64";
                        break;
                    case "application/x-zip-compressed":
                        this.fileFormat = "x-zip-compressed/base64"
                        break;
                    case "text/csv":
                        this.fileFormat = "csv/base64";
                        break;
                    default:
                        throw `The format "${file.type}" is not supported.`;
                }
                this.fileType = file.type;
                this.file = file;
            } catch (error) {
                this.file = null;
                this.$toast.add({ severity: "error", summary: "File selection error!", detail: `The format "${file.type}" is not supported.`, life: 3000 });
                event.files.length = 0;
            }
        },
        async onSubmit({ valid, values }) {
            try {
                this.isLoading = true;
                if(!valid) return;
                if(this.file == null) {
                    this.$toast.add({ severity: "error", summary: "Invalid file!", detail: `File source is required.`, life: 3000 });
                    return;
                }

                const dataSetStore = useDataSetStore();

                let request = {
                    name: values.name,
                    description: values.description,
                    content: [
                        {
                            format: this.fileFormat
                        }
                    ],
                    dataSetId: dataSetStore?.selectedDataSet?.id ?? null
                };

                const createDataLayerResult = await dataSetStore.createDataLayerForDataSet(this.file, request)
                if(createDataLayerResult?.success) {
                    this.close();
                    this.$emit("createdDataLayer");
                } else {
                    this.$toast.add({ severity: "error", summary: "Datalayer creation failed!", detail: `Something went wrong on the backend: "${createDataLayerResult.error}".` , life: 3000 });
                }
            } catch (error) {
                console.log(error)
                this.$toast.add({ severity: "error", summary: "Datalayer creation failed!", detail: `Something went wrong: "${error?.response?.data?.message ?? error}".` , life: 3000 });
            } finally {
                this.isLoading = false;
            }
        },
        close() {
            const dialogStore = useDialogStore();
            dialogStore.hideDataLayerCreateCatalog();

            this.initialValues = {
                name: "",
                description: "",
                format: ""
            };
            this.fileFormat = "";
        }
    }
}

</script>

<style lang="scss">

.p-fileupload span {
    overflow-x: hidden;
}

</style>