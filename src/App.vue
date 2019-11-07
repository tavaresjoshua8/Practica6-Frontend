<style lang="scss">
/*!
    * Remove 000webhost banner
*/
img[src*="https://cdn.000webhost.com/000webhost/logo/footer-powered-by-000webhost-white2.png"]{display:none}
</style>

<template>
	<v-app id="inspire">
		<v-navigation-drawer
			v-model="drawer"
			app
			clipped
		>
			<v-list dense>

				<v-subheader>VISTAS</v-subheader>
				<v-list-item link :to="{name: 'home'}">
					<v-list-item-action>
						<v-icon>mdi-home</v-icon>
					</v-list-item-action>
					<v-list-item-content>
						<v-list-item-title>Home</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
                <v-list-item link :to="{name: 'inventario'}">
					<v-list-item-action>
						<v-icon>mdi-book-outline</v-icon>
					</v-list-item-action>
					<v-list-item-content>
						<v-list-item-title>Inventario</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-list-item link :to="{name: 'reportes'}">
					<v-list-item-action>
						<v-icon>mdi-alert</v-icon>
					</v-list-item-action>
					<v-list-item-content>
						<v-list-item-title>Reportes</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list>
		</v-navigation-drawer>

		<v-app-bar
			app
			clipped-left
		>
			<v-app-bar-nav-icon @click.stop="drawer = !drawer" />
			<v-toolbar-title>Inventario</v-toolbar-title>
		</v-app-bar>

		<v-content>
			<v-container
				class="fill-height"
				fluid
			>
				<v-row
					align="center"
					justify="center"
				>
					<v-col class="shrink">
						<router-view></router-view>
					</v-col>
				</v-row>
			</v-container>
		</v-content>

		<v-footer app>
			<span>
				<v-icon small>mdi-coffee-outline</v-icon>
				Joshua Salcido
				&copy; 2019
			</span>
		</v-footer>
	</v-app>
</template>

<script>
export default {
	data: () => ({
		drawer: null,
	}),
}
</script>
