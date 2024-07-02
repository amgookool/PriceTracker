import { ToadScheduler, SimpleIntervalJob, AsyncTask } from 'toad-scheduler';
import type { SimpleIntervalSchedule } from 'toad-scheduler';

export const scheduler = new ToadScheduler();

/**
 * Creates a new asynchronous task with the given task name and task function.
 *
 * @param {string} taskName - The name of the task.
 * @param {(taskId: string | undefined, jobId: string | undefined) => Promise<void>} taskFunction - The function to be executed by the task.
 * @return {AsyncTask} The newly created asynchronous task.
 */
export const createTask = (
	taskName: string,
	taskFunction: (taskId: string | undefined, jobId: string | undefined) => Promise<void>,
) => {
	return new AsyncTask(taskName, taskFunction);
};

/**
 * Creates a new asynchronous job with the given task, job interval, and schedule ID.
 *
 * @param {AsyncTask} task - The task to be executed asynchronously.
 * @param {string} jobInterval - The interval at which the job should run.
 * @param {number} scheduleId - The ID of the schedule associated with the job.
 * @return {SimpleIntervalJob} A new SimpleIntervalJob instance.
 */
export const createJob = (task: AsyncTask, jobInterval: string, scheduleId: number) => {
	const schedule = jobInterval.split(' ');
	const integer = parseInt(schedule[0]);
	const unit = schedule[1];
	const jobOption = { id: `${scheduleId}`, preventOverrun: true };
	const taskOption = {
		[unit]: integer,
		runImmediately: false,
	} as SimpleIntervalSchedule;
	return new SimpleIntervalJob(taskOption, task, jobOption);
};

/**
 * Stops a job with the given schedule ID and returns its current status.
 *
 * @param {number} scheduleId - The ID of the schedule for the job to be stopped.
 * @return {Promise<SimpleIntervalSchedule['status']>} A Promise that resolves to the current status of the job.
 */
export const stopJob = (scheduleId: number) => {
	scheduler.stopById(`${scheduleId}`);
	return scheduler.getById(`${scheduleId}`).getStatus();
};

/**
 * Starts a job with the given schedule ID and returns its current status.
 *
 * @param {number} scheduleId - The ID of the schedule for the job to be started.
 * @return {SimpleIntervalSchedule['status']} The current status of the job.
 * @throws {Error} If the job with the given schedule ID is not found.
 */
export const startJob = (scheduleId: number) => {
	if (scheduler.existsById(`${scheduleId}`)) {
		scheduler.startById(`${scheduleId}`);
		return scheduler.getById(`${scheduleId}`).getStatus();
	} else {
		throw new Error('Job not found');
	}
};

/**
 * Removes a job with the specified schedule ID if it exists, otherwise throws an error.
 *
 * @param {number} scheduleId - The ID of the schedule for the job to be removed.
 * @return {void} This function does not return anything.
 */
export const removeJob = (scheduleId: number) => {
	if (scheduler.existsById(`${scheduleId}`)) {
		scheduler.removeById(`${scheduleId}`);
		return;
	} else {
		throw new Error('Job not found');
	}
};

/**
 * Retrieves the status of a job with the given schedule ID.
 *
 * @param {number} scheduleId - The ID of the schedule for the job.
 * @return {Promise<SimpleIntervalSchedule['status']>} The current status of the job.
 * @throws {Error} If the job with the given schedule ID is not found.
 */
export const getJobStatus = (scheduleId: number) => {
	if (scheduler.existsById(`${scheduleId}`)) {
		return scheduler.getById(`${scheduleId}`).getStatus();
	} else {
		throw new Error('Job not found');
	}
};

/**
 * Updates the job interval for a given schedule ID. If a job with the same schedule ID exists, it is removed before creating a new job with the updated interval.
 *
 * @param {number} scheduleId - The ID of the schedule for the job to be updated.
 * @param {string} jobInterval - The new interval for the job, formatted as a string with the integer value followed by the unit of time (e.g. "1 hours").
 * @param {AsyncTask} task - The task to be executed asynchronously by the job.
 * @return {SimpleIntervalJob} A new SimpleIntervalJob instance with the updated interval and task.
 */
export const updateJobInterval = (scheduleId: number, jobInterval: string, task: AsyncTask) => {
	if (scheduler.existsById(`${scheduleId}`)) {
		scheduler.removeById(`${scheduleId}`);
	}
	const schedule = jobInterval.split(' ');
	const integer = parseInt(schedule[0]);
	const unit = schedule[1];
	const jobOption = { id: `${scheduleId}`, preventOverrun: true };
	const taskOption = {
		[unit]: integer,
		runImmediately: false,
	} as SimpleIntervalSchedule;
	return new SimpleIntervalJob(taskOption, task, jobOption);
};
