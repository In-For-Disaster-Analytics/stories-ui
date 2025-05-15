import React from 'react';
import { useParams } from 'react-router-dom';
import { useDetailDataset } from '../../hooks/ckan/datasets/useDetailDataset';

const Story: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { dataset, isLoading, isError, error } = useDetailDataset(id);

  return (
    <div className="px-4 md:px-8 lg:px-12 lg:my-12 lg:py-12 lg:h-5/6 ">
      <section className="mx-auto max-w-screen-xl px-4 lg:px-8 flex flex-col gap-10">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{dataset?.name}</h1>
        </header>
      </section>
    </div>
  );
};

export default Story;
