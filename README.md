Instruction on how to run the project:

1. Please follow this instruction on the Azure portal:
- Create a resource group.
- Create an event hubs namespace.
- Create an event hub (with one partition only).
- Create a namespace service bus.
- Create a queue (2 queues) first one with the name (‘assessment-queue’) and second (‘assessment-queue-1’).
- For receiving events from the event hub, we should follow these steps:
  - Create an Azure storage account.
  - Create a blob container in the storage account.

2. After creating the previous services on Azure, I don’t know if the data structure that will come to the event hub, so I assume that data will come in JSON format {“key”: “value”} and depending on the key, I will forward the message to the specific service bus queue, so the first JSON that should go to the first queue is like:

   {

   `	`“test”: “test”

   }

   The second JSON that should go to the second queue is like this:

   {

   `	`“assessment”: “assessment”

   }

   you should push the data directly (Azure portal) to the event hub like samples.

3. I provided a .env example for the required environment variable needed to run the project.
4. npm install.
5. Create a new connection in mongoDb compass with name assessment so when the project runs => connect to the database and create the model.
6. npm run start:dev
