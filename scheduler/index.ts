import { ToadScheduler, SimpleIntervalJob, AsyncTask } from "toad-scheduler";
import type { SimpleIntervalSchedule } from "toad-scheduler";
const scheduler = new ToadScheduler();

const task1 = new AsyncTask("simple task", (taskId, jobId) => {
  console.log("Task1 triggered");
  console.log("Task Id:", taskId);
  console.log("Job Id:", jobId);
  return Promise.resolve();
});

const task2 = new AsyncTask("simple task", (taskId, jobId) => {
  console.log("Task2 triggered");
  console.log("Task Id:", taskId);
  console.log("Job Id:", jobId);
  return Promise.resolve();
});

const schedule1 = {
  seconds: 10,
  runImmediately: true,
} as SimpleIntervalSchedule;
const job1Option = { id: "id_1", preventOverrun: true };
const job1 = new SimpleIntervalJob(schedule1, task1, job1Option);

const schedule2 = {
  seconds: 15,
  runImmediately: true,
} as SimpleIntervalSchedule;

const job2Option = { id: "id_2", preventOverrun: true };
const job2 = new SimpleIntervalJob(schedule2, task2, job2Option);

//create and start jobs
scheduler.addSimpleIntervalJob(job1);
scheduler.addSimpleIntervalJob(job2);

// stop job with ID: id_2
// scheduler.stopById('id_2');

// remove job with ID: id_1
// scheduler.removeById('id_1');

// check status of jobs
console.log(scheduler.getById("id_1").getStatus()); // returns Error (job not found)

console.log(scheduler.getById("id_2").getStatus()); // returns "stopped" and can be started again
