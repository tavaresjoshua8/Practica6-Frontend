<template>
	<div>
		<v-tooltip right>
			<template v-slot:activator="{ on }">
				<v-btn
					href="https://github.com/tavaresjoshua8"
					icon
					large
					target="_blank"
					v-on="on"
				>
					<v-icon large>mdi-github-circle</v-icon>
				</v-btn>
			</template>
			<span>GitHub Profile</span>
		</v-tooltip>
		<v-tooltip right>
			<template v-slot:activator="{ on }">
				<v-btn
					href="https://www.linkedin.com/in/joshua-tavares-30b1b418a/"
					icon
					large
					target="_blank"
					v-on="on"
				>
					<v-icon large>mdi-linkedin</v-icon>
				</v-btn>
			</template>
			<span>LinkedIn Profile</span>
		</v-tooltip>
		<v-tooltip right>
			<template v-slot:activator="{ on }">
				<v-btn
					href="https://twitter.com/tavaresjoshua8"
					icon
					large
					target="_blank"
					v-on="on"
				>
					<v-icon large>mdi-twitter-circle</v-icon>
				</v-btn>
			</template>
			<span>Twitter Profile</span>
		</v-tooltip>
		<v-tooltip right>
			<template v-slot:activator="{ on }">
				<v-btn
					href="mailto:tavaresjoshua8@gmail.com"
					icon
					large
					target="_blank"
					v-on="on"
				>
					<v-icon>mdi-gmail</v-icon>
				</v-btn>
			</template>
			<span>E-mail</span>
		</v-tooltip>
	</div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
	name: 'home'/*,
	components: {
		HelloWorld
	}*/
}
</script>
