import React from 'react';
import { CreateResourceForm } from '../../components/CreateResourceForm';

const NewStory: React.FC = () => {
  return (
    <div className="px-4 md:px-8 lg:px-12 lg:my-12 lg:py-12 lg:h-5/6 sm:my-4 sm:py-4 ">
      <section className="mx-auto max-w-screen-xl px-4 lg:px-8 flex flex-col gap-10">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Create New Story</h1>
        </header>
        <CreateResourceForm packageId="my-dataset-name" />
      </section>
    </div>
  );
};

export default NewStory;
