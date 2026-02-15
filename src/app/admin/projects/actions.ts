// server actions must live in a server component or a standalone module
'use server';

import { connectDB } from '@/lib/db';
import { Project } from '@/models';
import { revalidatePath } from 'next/cache';

export async function createProjectAction(formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const media = JSON.parse((formData.get('media') as string) || '[]');

  // perform the same business logic currently in the API route
  await connectDB();
  const project = await Project.create({ title, description, media });

  // revalidate the listing page so the new project appears
  revalidatePath('/admin/projects');
  return project;
}
