<script setup lang="ts">

interface PropertySummary {
  property: string; // Example: "properties/449137298"
  displayName: string; // Example: "finalyear-d910b"
  propertyType: string; // Example: "PROPERTY_TYPE_ORDINARY"
  parent: string; // Example: "accounts/320803120"
}

interface AccountSummary {
  name: string; // Example: "accountSummaries/320803120"
  account: string; // Example: "accounts/320803120"
  displayName: string; // Example: "Default Account for Firebase"
  propertySummaries: PropertySummary[];
}

const startDate = ref(formatDate(new Date(Date.now() - 4 * 7 * 24 * 60 * 60 * 1000)))
const endDate = ref(formatDate(new Date()));
const graphData = ref(Array.from({ length: getWeekInYear(new Date(startDate.value).getUTCFullYear()) }, (_, i) => ({
  week: i + 1,
  'Number of users': 0
})))
const gaphDataByCountry = ref<{
  country: string,
  "Number of Active users": number
}[]>([])
const propertyId = ref('properties/449137298')
const accountId = ref('')
const accounts = ref<AccountSummary[]>([]);
const properties = computed(() =>
  accounts.value.find(acc => acc.account === accountId.value)?.propertySummaries ?? [])

console.log("Account Id: ", { accountId, propertyId })

function generateGraphData(result: any, fullGraphData: {
  week: number;
  'Number of users': number;
}[]) {
  const weeksCount = fullGraphData.length;

  // Populate the array with actual data
  result.rows.forEach((row: any) => {
    const week = parseInt(row.dimensionValues[0].value, 10);
    const users = parseInt(row.metricValues[0].value, 10);
    if (week > 0 && week <= weeksCount) {
      fullGraphData[week - 1]['Number of users'] = users;
    }
  });

  return fullGraphData;
}

function createGraphDataByCountry(response: any) {
  const graphData: {
    country: string,
    "Number of Active users": number
  }[] = [];

  // Process each row in the response
  response.rows.forEach((row: any) => {
    const country = row.dimensionValues[0].value as string;
    const activeUsers = parseInt(row.metricValues[0].value, 10);

    // Update graph data with country and active users
    graphData.push({ country, "Number of Active users": activeUsers });
  });

  gaphDataByCountry.value = graphData;
}

const { data, signIn, signOut, status, getSession } = useAuth()

const session = await getSession();

const fetchAnalyticsData = async () => {
  try {
    const session = await getSession(); // Get session data

    if (!session || !session.accessToken) {
      throw new Error('Missing access token');
    }

    const accessToken = session.accessToken;

    const data = await $fetch('https://analyticsadmin.googleapis.com/v1beta/accountSummaries', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }) as {
      accountSummaries: AccountSummary[];
    }

    accounts.value = data?.accountSummaries;

  } catch (error) {
    console.error('Error fetching analytics data:', error);
  }
}

async function getActiveUserWeekly() {
  try {
    const result = await $fetch(`https://analyticsdata.googleapis.com/v1beta/${propertyId.value}:runReport`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`
      },
      body: {
        "dateRanges": [
          {
            "startDate": startDate.value,
            "endDate": endDate.value
          }
        ],
        "dimensions": [
          {
            "name": "week"
          }
        ],
        "metrics": [
          {
            "name": "activeUsers"
          }
        ]
      }
    })

    console.log("Result: ", result)
    console.log("Graph Data 3: ", generateGraphData(result, graphData.value))
  } catch (error) {
    console.log("Error: ", error)
  }
}

async function getActiveUserByCountry() {
  try {
    const result = await $fetch(`https://analyticsdata.googleapis.com/v1beta/${propertyId.value}:runReport`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`
      },
      body: {
        "dateRanges": [
          {
            "startDate": startDate.value,
            "endDate": endDate.value
          }
        ],
        "dimensions": [
          {
            "name": "country"
          }
        ],
        "metrics": [
          {
            "name": "sessions"
          }
        ],
        "limit": "10"
      }
    })

    console.log("get Active user by country: ", result)

    createGraphDataByCountry(result);

    console.log("Graph Data: ", gaphDataByCountry.value)
  } catch (error) {
    console.log("Error: ", error)
  }
}
</script>

<template>
  <main class="flex flex-col items-center justify-center px-4 mx-auto max-w-7xl">
    <nav class="flex flex-row items-center gap-2 my-6">
      <button @click="signOut()" class="px-4 py-2 text-gray-900 bg-white rounded cursor-pointer">Sign out</button>
      <button @click="fetchAnalyticsData()" class="px-4 py-2 text-gray-900 bg-white rounded cursor-pointer">Fetch
        Account Summary</button>
      <button @click="getActiveUserWeekly()" class="px-4 py-2 text-gray-900 bg-white rounded cursor-pointer">Get Active
        User Weekly</button>
      <button @click="getActiveUserByCountry()" class="px-4 py-2 text-gray-900 bg-white rounded cursor-pointer">Get
        Active
        Users By Country</button>
    </nav>

    <section class="flex flex-row items-center justify-between w-full">
      <Select v-model="accountId">
        <SelectTrigger>
          <SelectValue placeholder="Select an account" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Accounts</SelectLabel>
            <SelectItem v-for="account in accounts" :key="account.displayName" :value="account.account">
              {{ account.displayName.toUpperCase() }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select v-model="propertyId">
        <SelectTrigger>
          <SelectValue placeholder="Select a property" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Projects</SelectLabel>
            <SelectItem v-for="property in properties" :key="property.property" :value="property.property">
              {{ property.displayName.toUpperCase() }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </section>

    <section class="p-8 my-8 space-y-6 bg-slate-800 rounded-2xl">
      <div class="flex flex-row items-center justify-end w-full ml-auto gap-x-4">
        <h3 class="mr-auto text-2xl font-semibold text-white">Weekly Active Users</h3>

        <div class="px-4 py-2 bg-white rounded-lg w-fit text-foreground">
          <p>Start Date: {{ startDate }}</p>
        </div>
        <div class="px-4 py-2 bg-white rounded-lg w-fit text-foreground">
          <p>End Date: {{ endDate }}</p>
        </div>
      </div>
      <LineChart title="Users Per Week" class="w-[80vw] h-[50vh]" :data="graphData" index="week"
        :colors="['blue', 'pink', 'orange', 'red']" :categories="['Number of users']" :y-formatter="(tick: any, i: any) => {
          return tick
        }" />
    </section>

    <section class="p-8 my-8 mt-6 space-y-6 bg-slate-800 rounded-2xl">

      <div class="flex flex-row items-center justify-end w-full ml-auto gap-x-4">
        <h3 class="mr-auto text-2xl font-semibold text-white">Active Users By Country</h3>
      </div>
      <LineChart title="Active Users By Country" class="w-[80vw] h-[50vh]" :data="gaphDataByCountry" index="country"
        :colors="['pink', 'pink', 'orange', 'red']" :categories="['Number of Active users']" :y-formatter="(tick: any, i: any) => {
          return tick
        }" />
    </section>
  </main>
</template>
