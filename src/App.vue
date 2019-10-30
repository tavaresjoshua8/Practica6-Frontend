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
				<v-list-item link>
					<v-list-item-action>
						<v-icon>mdi-settings</v-icon>
					</v-list-item-action>
					<v-list-item-content>
						<v-list-item-title>Settings</v-list-item-title>
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
                <v-icon small>mdi-database-check</v-icon>
                Aranza Alanis
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
