import { Stack } from 'expo-router';

export default function JobsLayout() {
  return (
    <Stack screenOptions={{
      headerShown: false,
    }}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="post"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="manage"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[id]/applicants"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[id]/edit"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
} 