import {
	createJob,
	startJob,
	stopJob,
	removeJob,
	getJobStatus,
	updateJobInterval,
	createTask,
	scheduler,
} from '@scheduler/scheduler';

export const ScheduleService = { createJob, startJob, stopJob, removeJob, getJobStatus, updateJobInterval, createTask };

export default scheduler;
