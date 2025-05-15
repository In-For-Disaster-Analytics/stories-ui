import StoriesCard from '../../../components/StoriesCard';
import { useListDatasets } from '../../../hooks/ckan/datasets/useListDatasets';

const Layout: React.FC = () => {
  const { datasets } = useListDatasets();

  return (
    <div className="px-4 md:px-8 lg:px-12 lg:my-12 lg:py-12 lg:h-5/6 ">
      <section className="mx-auto max-w-screen-xl px-4 lg:px-8 flex flex-col gap-10">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Home</h1>
        </header>
        <div className="flex items-center gap-4">
          {datasets?.map((dataset) => (
            <StoriesCard
              id={dataset.id}
              title={dataset.title}
              description={dataset.notes || ''}
              tags={dataset.tags.map((tag) => tag.name)}
              author={dataset.author.name || ''}
              date={dataset.created || new Date()}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Layout;
