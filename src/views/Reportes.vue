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
                    <v-toolbar-title>Reportes</v-toolbar-title>
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
                            <v-btn color="primary" dark class="mb-2" v-on="on">Nuevo Reporte</v-btn>
                        </template>
                        <v-card :loading="savingItems">
                            <v-card-title>
                                <span class="headline">{{ formTitle }}</span>
                            </v-card-title>
                            <v-card-text>
                                <v-container>
                                    <v-form ref="form">
                                        <v-row>
                                            <v-col cols="12">
                                                <v-select label="Computadora"
                                                    :items="computers"
                                                    v-model="editedItem.computer_id"></v-select>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-date-picker label="Fecha"
                                                    v-model="editedItem.date"></v-date-picker>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-textarea label="Descripción"
                                                    v-model="editedItem.description"
                                                    :rules="rules.required"></v-textarea>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-textarea label="Solución"
                                                    v-model="editedItem.solution"></v-textarea>
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
            Reporte Eliminado.
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
        snackbar: {
            show: false,
            message: '',
            color: 'cyan darken-2',
            close: 'Cerrar',
        },
        deletedSnackbar: false,
        loadingItems: false,
        savingItems: false,
        search: '',
        computers: [],
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
            { text: 'No. de Reporte', value: 'id' },
            { text: 'Computadora', value: 'computer.name' },
            { text: 'Fecha', value: 'date' },
            { text: 'Descripción', value: 'description' },
            { text: 'Solución', value: 'solution' },
            { text: 'Acciones', value: 'action', sortable: false },
        ],
        items: [],
        editedIndex: -1,
        editedItem: {
            id: 0,
            computer_id: 0,
            date: '',
            description: '',
            solution: '',
            computer: {
                name: ''
            }
        },
        defaultItem: {
            id: 0,
            computer_id: 0,
            date: '',
            description: '',
            solution: '',
            computer: {
                name: ''
            }
        },
        lastDeletedItem: {},
    }),

    computed: {
        formTitle () {
            return this.editedIndex === -1 ? 'Nuevo Reporte' : 'Editar Reporte'
        },
        imageRules() {
            if( this.editedIndex === -1 )
                return [
                    v => !!v || 'Este campo es necesario.'
                ]

            return []
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
            this.loadingItems = true
            axios.get('/api/reports')
            .then(response => {
                this.items = response.data
                this.loadingItems = false
            })
            axios.get('/api/computers/select')
             .then(response => {
                 this.computers = response.data
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
                axios.delete('/api/reports/' + item.id,)
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
                axios.put('/api/reports/' + this.editedItem.id, {
                    report: this.editedItem
                })
                .then( response => {
                    this.savingItems = false
                    Object.assign(this.items[this.editedIndex], response.data)
                    this.close()
                    this.showSnackbar('Item actualizado con éxito.')
                }).catch( error => {
                    this.setResponseError(error)
                    this.savingItems = false
                })
            } else { // Save
                axios.post('/api/reports', {
                    report: this.editedItem
                })
                .then( response => {
                    this.savingItems = false
                    this.items.push(response.data)
                    this.close()
                    this.showSnackbar('Item guardado con éxito.')
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

        slug: (str) => {
            str = str.replace(/^\s+|\s+$/g, '') // trim
            str = str.toLowerCase()

            // remove accents, swap ñ for n, etc
            var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;"
            var to   = "aaaaaeeeeeiiiiooooouuuunc------"
            for (var i=0, l=from.length ; i<l ; i++) {
                str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
            }

            str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
                .replace(/\s+/g, '-') // collapse whitespace and replace by -
                .replace(/-+/g, '-') // collapse dashes

            return str;
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
