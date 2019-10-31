<template>
    <div>
        <v-data-table
            loading-text="Cargando..."
            sort-by="folio"
            class="elevation-1"
            :headers="headers"
            :items="items"
            :search="search"
            :loading="loadingItems"
        >
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>Computadoras</v-toolbar-title>
                    <v-divider
                        class="mx-4"
                        inset
                        vertical
                    ></v-divider>
                    <v-spacer></v-spacer>
                    <v-text-field
                        label="Buscar"
                        v-model="search"
                        :append-icon="mdiMagnify"
                        singleLine
                        hideDetails
                    ></v-text-field>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="500px">
                        <template v-slot:activator="{ on }">
                            <v-btn color="primary" dark class="mb-2" v-on="on">Nueva Computadora</v-btn>
                        </template>
                        <v-card :loading="savingItems">
                            <v-card-title>
                                <span class="headline">{{ formTitle }}</span>
                            </v-card-title>
                            <v-card-text>
                                <v-container>
                                    <v-form ref="form">
                                        <v-row>
                                            <v-col cols="12" sm="6">
                                                <v-text-field label="Nombre"
                                                    v-model="editedItem.name"
                                                    :rules="rules.required"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6">
                                                <v-text-field label="Sistema Operativo"
                                                    v-model="editedItem.operative_system"
                                                    :rules="rules.required"></v-text-field>
                                            </v-col>
                                        </v-row>
                                        <h2>Hardware</h2>
                                        <v-row>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field label="Modelo"
                                                    v-model="editedItem.hardware.model"
                                                    :rules="rules.required"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field label="Marca"
                                                    v-model="editedItem.hardware.brand"
                                                    :rules="rules.required"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field label="No. de Serie"
                                                    v-model="editedItem.hardware.serial"
                                                    :rules="rules.required"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field label="RAM"
                                                    v-model="editedItem.hardware.ram"
                                                    :rules="rules.required"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field label="Procesador"
                                                    v-model="editedItem.hardware.processor"
                                                    :rules="rules.required"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field label="Disco Duro"
                                                    v-model="editedItem.hardware.hdd"
                                                    :rules="rules.required"></v-text-field>
                                            </v-col>
                                        </v-row>
                                        <h2>Ubicación</h2>
                                        <v-row>
                                            <v-col cols="12" sm="6">
                                                <v-text-field label="Departamento"
                                                    v-model="editedItem.location.department"
                                                    :rules="rules.required"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6">
                                                <v-text-field label="Responsable"
                                                    v-model="editedItem.location.leader"
                                                    :rules="rules.required"></v-text-field>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-textarea label="Observaciones"
                                                    v-model="editedItem.location.observations"></v-textarea>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-alert type="error"
                                                    v-if="response.error"
                                                >
                                                    {{ response.message }}
                                                </v-alert>
                                            </v-col>
                                        </v-row>
                                    </v-form>
                                </v-container>
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
                                <v-btn color="blue darken-1" text @click="save">Guardar</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-toolbar>
            </template>

            <template v-slot:item.action="{ item }">
                <v-icon small
                    class="mr-2"
                    @click="editItem(item)"
                >
                    mdi-pencil
                </v-icon>
                <v-icon small
                    @click="deleteItem(item)"
                >
                    mdi-delete
                </v-icon>
            </template>
            <template v-slot:no-data>
                <v-btn color="primary" @click="initialize">Reiniciar</v-btn>
            </template>
        </v-data-table>
        <v-snackbar
            :color="snackbar.color"
            v-model="snackbar.show"
            top
        >
            {{ snackbar.message }}
            <v-btn
                dark
                text
                @click="snackbar.show = false"
            >
                {{ snackbar.close }}
            </v-btn>
        </v-snackbar>
        <v-snackbar
            color="error"
            v-model="deletedSnackbar"
            top
        >
            Computadora Eliminada.
            <v-btn
                dark
                text
                @click="backDeletedItem"
            >
                Deshacer
            </v-btn>
        </v-snackbar>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    data: () => ({
        loadingItems: false,
        savingItems: false,
        search: '',
        dialog: false,
        response: {
            error: false,
            message: '',
        },
        rules: {
            required: [
                v => !!v || 'Este campo es necesario.'
            ]
        },
        headers: [
            { text: 'Nombre', value: 'name' },
            { text: 'S.O', value: 'operative_system' },
            { text: 'Modelo', value: 'hardware.model' },
            { text: 'Marca', value: 'hardware.brand' },
            { text: 'No. de Serie', value: 'hardware.serial', sortable: false },
            { text: 'RAM', value: 'hardware.ram' },
            { text: 'Procesador', value: 'hardware.processor' },
            { text: 'Disco Duro', value: 'hardware.hdd' },
            { text: 'Departamento', value: 'location.department' },
            { text: 'Acciones', value: 'action', sortable: false },
        ],
        items: [],
        editedIndex: -1,
        editedItem: {},
        lastDeletedItem: {},
        defaultItem: {
            id: 0,
            name: '',
            operative_system: '',
            hardware: {
                model: '',
                brand: '',
                serial: '',
                ram: '',
                processor: '',
                hdd: '',
            },
            location: {
                department: '',
                leader: '',
                observations: '',
            }
        },
        snackbar: {
            show: false,
            message: '',
            color: 'cyan darken-2',
            close: 'Cerrar',
        },
        deletedSnackbar: false,
    }),

    computed: {
        formTitle () {
            return this.editedIndex === -1 ? 'Nueva Computadora' : 'Editar Computadora'
        }
    },

    watch: {
        dialog (val) {
            val || this.close()
        }
    },

    created () {
      this.initialize()
    },

    methods: {
        initialize () {
            this.editedItem = Object.assign({}, this.defaultItem)
            this.loadingItems = true
            axios.get('/api/computers')
            .then(response => {
                this.items = response.data
                this.loadingItems = false
            })
        },

        editItem (item) {
            this.editedIndex = this.items.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },

        deleteItem (item) {
            const index = this.items.indexOf(item)
            if( confirm('¿Está seguro que quiere eliminar este item?') ){
                this.loadingItems = true
                axios.delete('/api/computers/' + item.id,)
                 .then( response => {
                    this.lastDeletedItem = response.data
                    this.loadingItems = false
                    this.items.splice(index, 1)
                    this.showDeletedSnackbar()
                }).catch( error => {
                    this.loadingItems = false
                    this.showSnackbar(error.response.data.message, 'error')
                })
            }
        },

        close () {
            this.$refs.form.resetValidation()
            this.setResponseError(null)
            this.dialog = false
            this.image = null
            setTimeout(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            }, 300)
        },

        save () {
            if( !this.$refs.form.validate() ) // Form isn't valid?
                return

            this.savingItems = true
            this.setResponseError(null)
            if (this.editedIndex > -1) { // Update
                axios.put('/api/computers/' + this.editedItem.id, {
                    computer: this.editedItem
                })
                .then( response => {
                    this.savingItems = false
                    Object.assign(this.items[this.editedIndex], response.data)
                    this.close()
                    this.showSnackbar('Computadora actualizada con éxito.')
                }).catch( error => {
                    this.setResponseError(error)
                    this.savingItems = false
                })
            } else { // Save
                axios.post('/api/computers', {
                    computer: this.editedItem
                })
                .then( response => {
                    this.savingItems = false
                    this.items.push(response.data)
                    this.close()
                    this.showSnackbar('Computadora guardada con éxito.')
                }).catch( error => {
                    this.setResponseError(error)
                    this.savingItems = false
                })
            }
        },

        backDeletedItem() {
            this.editItem( this.lastDeletedItem )
            this.deletedSnackbar = false
        },

        setResponseError(error) {
            if( error == null ){
                this.response = {
                    error: false,
                    message: ''
                }
            } else {
                this.response = {
                    error: true,
                    message: error.response.data.message
                }
            }
        },

        showSnackbar(message, color = 'cyan darken-2', close = 'Cerrar') {
            this.snackbar = {
                color, // Shortcut from color: color
                message,
                close,
                show: true,
            }
        },

        showDeletedSnackbar() {
            this.deletedSnackbar = true
        }
    },
}
</script>
