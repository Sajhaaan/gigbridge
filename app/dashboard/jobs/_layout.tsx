import { Stack } from 'expo-router';

export default function JobsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Jobs',
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Job Details',
        }}
      />
      <Stack.Screen
        name="post"
        options={{
          title: 'Post a Job',
        }}
      />
      <Stack.Screen
        name="manage"
        options={{
          title: 'Manage Jobs',
        }}
      />
      <Stack.Screen
        name="[id]/applicants"
        options={{
          title: 'Job Applicants',
        }}
      />
      <Stack.Screen
        name="[id]/edit"
        options={{
          title: 'Edit Job',
        }}
      />
    </Stack>
  );
} 