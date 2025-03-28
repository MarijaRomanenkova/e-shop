/**
 * Homepage Component
 * @module Pages
 * @group Root Pages
 * 
 * This page serves as the main landing page for the application,
 * displaying the newest tasks and a button to view all available tasks.
 */

import TaskList from '@/components/shared/task/task-list';
import {
  getLatestTasks,
} from '@/lib/actions/task.actions';
import ViewAllTasksButton from '@/components/view-all-tasks-button';

/**
 * Homepage Component
 * 
 * This server component renders the application's landing page,
 * fetching and displaying the most recent tasks.
 * 
 * Features:
 * - Displays a limited number of newest tasks
 * - Provides a button to navigate to the full tasks page
 * 
 * @component
 * @returns {JSX.Element} Homepage with task list and navigation button
 */
const Homepage = async () => {
  // Fetch the latest tasks for the homepage
  const latesttasks = await getLatestTasks();

  return (
    <>
      <TaskList data={latesttasks} title='Newest Tasks' limit={12} />
      <ViewAllTasksButton />
    </>
  );
};

export default Homepage;
