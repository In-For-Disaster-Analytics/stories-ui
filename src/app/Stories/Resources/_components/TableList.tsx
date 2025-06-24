import React from 'react';
import { useStory } from '../../StoryContext';

const TableList: React.FC = () => {
  const { resources } = useStory();

  return (
    <div className="resources-container">
      <h2 className="text-2xl font-bold mb-4">Resources</h2>
      <div className="resources-table-container">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Type
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {resources.map((resource) => (
              <tr key={resource.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {resource.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {resource.mimetype}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                    onClick={() => console.log('Preview', resource.id)}
                  >
                    Preview
                  </button>
                  <button
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                    onClick={() => console.log('Embed', resource.id)}
                  >
                    Embed
                  </button>
                  {resource.mimetype === 'audio/mpeg' && (
                    <button
                      className="text-indigo-600 hover:text-indigo-900"
                      onClick={() => console.log('Transcribe', resource.url)}
                    >
                      Transcribe
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableList;
