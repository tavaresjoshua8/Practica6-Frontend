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
                    <v-toolbar-title>Items</v-toolbar-title>
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
                            <v-btn color="primary" dark class="mb-2" v-on="on">Nuevo Item</v-btn>
                        </template>
                        <v-card :loading="savingBook">
                            <v-card-title>
                                <span class="headline">{{ formTitle }}</span>
                            </v-card-title>
                            <v-card-text>
                                <v-container>
                                    <v-form ref="form">
                                        <v-row>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field label="Folio"
                                                    v-model="editedItem.folio"
                                                    :rules="rules.folio"></v-text-field>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-text-field label="Nombre"
                                                    v-model="editedItem.name"
                                                    :rules="rules.required"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-text-field label="Slug"
                                                    v-model="editedItem.slug"
                                                    :rules="rules.required"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field label="Autor"
                                                    v-model="editedItem.author"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field label="Editorial"
                                                    v-model="editedItem.editorial"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field label="Edición"
                                                    v-model="editedItem.issue"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field label="Páginas"
                                                    v-model="editedItem.pages"
                                                    :rules="rules.required"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field label="Traducción"
                                                    v-model="editedItem.translation"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field label="Año"
                                                    v-model="editedItem.year"
                                                    :rules="rules.year"></v-text-field>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-textarea label="Reseña"
                                                    v-model="editedItem.review"
                                                    :rules="rules.required"></v-textarea>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-text-field label="PDF"
                                                    v-model="editedItem.pdf"
                                                    :rules="rules.required"></v-text-field>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-file-input label="Portada"
                                                    placeholder="Seleccione la portada"
                                                    prepend-icon="mdi-camera"
                                                    accept="image/*"
                                                    show-size
                                                    outlined
                                                    v-model="image"
                                                    :rules="imageRules"
                                                ></v-file-input>
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
            Item Eliminado.
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
        image: null,
        loadingItems: false,
        savingBook: false,
        search: '',
        dialog: false,
        response: {
            error: false,
            message: '',
        },
        rules: {
            required: [
                v => !!v || 'Este campo es necesario.'
            ],
            folio: [
                v => !!v || 'El folio no puede ser nulo.',
                v => /^-?\d*[.]?\d*$/.test(v) || 'El folio debe ser númerico.'
            ],
            year: [
                v => !v || /^\d{4}$/.test(v) || 'Año no válido.',
                v => !v || !(v < 1800) || 'El año no puede ser menor a: 1800',
                v => !v || !(v > new Date().getFullYear()) || 'El año no puede ser mayor a el año actual.'
            ]
        },
        headers: [
            { text: 'Folio', align: 'left', value: 'folio' },
            { text: 'Nombre', value: 'name' },
            { text: 'Autor', value: 'author' },
            { text: 'Editorial', value: 'editorial' },
            { text: 'Edición', value: 'issue' },
            { text: 'Paginas', value: 'pages', sortable: false },
            { text: 'Traducción', value: 'translation' },
            { text: 'Año', value: 'year' },
            { text: 'Acciones', value: 'action', sortable: false },
        ],
        items: [],
        editedIndex: -1,
        editedItem: {
            id: 0,
            folio: 0,
            name: '',
            slug: '',
            author: '',
            editorial: '',
            issue: '',
            pages: '0001-',
            translation: '',
            year: 1999,
            review: '',
            pdf: '',
            image: null,
        },
        defaultItem: {
            id: 0,
            folio: 0,
            name: '',
            slug: '',
            author: '',
            editorial: '',
            issue: '',
            pages: '0001-',
            translation: '',
            year: 1999,
            review: '',
            pdf: '',
            image: null,
        },
        lastDeletedItem: {},
    }),

    computed: {
        formTitle () {
            return this.editedIndex === -1 ? 'Nuevo Item' : 'Editar Item'
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
        },
        'editedItem.name': function(val){
            this.editedItem.slug = this.slug(val)
        },
        image: function(val){
            if( val!=null ){
                let reader = new FileReader()
                reader.onload = () => {
                    this.editedItem.image = reader.result
                }
                reader.readAsDataURL(val)
            }
        }
    },

    created () {
      this.initialize()
    },

    methods: {
        initialize () {
            this.loadingItems = true
            axios.get('/api/items')
            .then(response => {
                this.items = response.data
                this.loadingItems = false
            })
        },

        editItem (item) {
            this.editedFolio = item.folio
            this.editedIndex = this.items.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },

        deleteItem (item) {
            const index = this.items.indexOf(item)
            if( confirm('¿Está seguro que quiere eliminar este item?') ){
                this.loadingItems = true
                axios.delete('/api/items', {
                    params: {
                        id: item.id,
                    }
                }).then( response => {
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
                this.editedFolio = -1
                this.editedIndex = -1
            }, 300)
        },

        save () {
            if( !this.$refs.form.validate() ) // Form isn't valid?
                return

            this.savingBook = true
            this.setResponseError(null)
            if (this.editedIndex > -1) {
                axios.put('/api/items', {
                    item: this.editedItem
                })
                .then( response => {
                    this.savingBook = false
                    Object.assign(this.items[this.editedIndex], response.data)
                    this.close()
                    this.showSnackbar('Item actualizado con éxito.')
                }).catch( error => {
                    this.setResponseError(error)
                    this.savingBook = false
                })
            } else {
                axios.post('/api/items', {
                    item: this.editedItem
                })
                .then( response => {
                    this.savingBook = false
                    this.items.push(response.data)
                    this.close()
                    this.showSnackbar('Item guardado con éxito.')
                }).catch( error => {
                    this.setResponseError(error)
                    this.savingBook = false
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
