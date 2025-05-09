import React from 'react';

const NewStory: React.FC = () => {
  return (
    <div className="px-4 md:px-8 lg:px-12 lg:my-12 lg:py-12 lg:h-5/6 sm:my-4 sm:py-4 ">
      <section className="mx-auto max-w-screen-xl px-4 lg:px-8 flex flex-col gap-10">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Create New Story</h1>
        </header>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <input
              type="text"
              id="title"
              className="border border-gray-300 rounded-lg p-2"
              placeholder="Enter story title"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="content" className="text-sm font-medium">
              Content
            </label>
            <textarea
              id="content"
              className="border border-gray-300 rounded-lg p-2 min-h-[200px]"
              placeholder="Write your story here..."
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="File"
              className="flex flex-col items-center rounded border border-gray-300 p-4 text-gray-900 shadow-sm sm:p-6"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75"
                />
              </svg>

              <span className="mt-4 font-medium"> Upload your file(s) </span>

              <span className="mt-2 inline-block rounded border border-gray-200 bg-gray-50 px-3 py-1.5 text-center text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-100">
                Browse files
              </span>

              <input multiple type="file" id="File" className="sr-only" />
            </label>
          </div>
          <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
            Create Story
          </button>
        </div>
      </section>
    </div>
  );
};

export default NewStory;
