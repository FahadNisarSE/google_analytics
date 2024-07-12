<script setup lang="ts">
definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/',
  }
})

const username = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false);

const { signIn } = useAuth()

const onSubmission = async () => {
  try {
    loading.value = true

    loading.value = false
  } catch (error) {
    loading.value = false
  }
}

const signInWithGoogle = async () => {
  const result = await signIn('google');
  console.log("Result: ", result)
}

</script>

<template>
  <main class="flex items-center justify-center h-screen">
    <div class="p-5 bg-gray-700 rounded-xl">
      <h3 class="mb-5 text-2xl font-semibold text-center text-white">Login</h3>
      <form @submit.prevent="onSubmission" class="flex flex-col items-center gap-4">
        <button @click="signInWithGoogle()" class="flex items-center w-full px-4 py-2 my-2 bg-white rounded-lg">
          <span class="mx-auto font-semibold text-gray-900">Sign in With Google</span>
        </button>

        <label class="flex flex-col w-full gap-1 text-sm">
          Username:
          <input placeholder="John Doe" class="text-gray-900 min-w-[300px] px-4 py-2 rounded" type="text" name="username"
            id="username" v-model="username">
        </label>
        <label class="flex flex-col w-full gap-1 text-sm">
          Email:
          <input placeholder="john@mail.com" class="text-gray-900 min-w-[300px] px-4 py-2 rounded" type="email"
            name="email" id="email" v-model="email">
        </label>
        <label class="flex flex-col w-full gap-1 text-sm">
          Password:
          <input placeholder="********" class="text-gray-900 min-w-[300px] px-4 py-2 rounded" type="password"
            name="password" id="password" v-model="password">
        </label>

        <button type="submit" class="px-4 py-2 bg-gray-900 rounded cursor-pointer">Register</button>
      </form>
    </div>
  </main>
</template>
