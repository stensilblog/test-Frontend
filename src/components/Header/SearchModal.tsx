"use client";

import { FC, Fragment, ReactNode, useState } from "react";
import { Combobox, Dialog, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import {
  ExclamationTriangleIcon,
  FolderIcon,
  LifebuoyIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { DEMO_AUTHORS } from "@/data/authors";
import supabaseClient from "@/utils/supabaseClient";
import Link from "next/link";
import { useGlobalContext } from "@/context/GlobalContextProvider";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading/Loading";

const authors = DEMO_AUTHORS.filter((_, i) => i < 9);

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

interface Props {
  renderTrigger?: () => ReactNode;
}

const supabaseSearch = async (table: any, content: any, column: any, domain1: string, domain2: string, search: string) => {
  const { data, error } = await supabaseClient
    .from(table)
    .select(content)
    .eq('authors.username', domain1)
    .eq('authors.cus_domain', domain2)
    .textSearch(column, `'${search}'`)

    return { data, error }
} 

const SearchModal: FC<Props> = ({ renderTrigger }) => {
  const [open, setOpen] = useState(false);
  const [rawQuery, setRawQuery] = useState("a");

  const { post, domain1, domain2 } = useGlobalContext();

  const initPost = post ? post.slice(0, 2) : [];

  const categoryFilter = post ? initPost.map((item: any) => { return item.category }).filter((v: any, i: any, a: any) => a.findIndex((t: any) => (t.id === v.id)) === i).filter((item: any) => { return item.name !== "News" }) : [];

  const [filteredPosts, setfilteredPosts] = useState<any>([]);
  const [filteredCategories, setfilteredCategories] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [noData, setnoData] = useState<boolean>(false);

  const router = useRouter();

  const fetchCat = async (search: string) => {
    const { data, error } = await supabaseSearch('category', `id, title, name, href, authors!inner(*)`, 'title', domain1, domain2, search);

    if(error || data?.length === 0) {
      setnoData(true);
      return [];
    }
    setnoData(false);
    return data;
  }

  const fetchPost = async (search: string) => {
      const { data, error } = await supabaseSearch('posts', `id, posttitle, href, authors!inner(*)`, 'title', domain1, domain2, search);

      if(error || data?.length === 0) {
        setnoData(true);
        return [];
      }
      setnoData(false);
      return data;
  }
  
  const search = async (e:any) => {
    setLoading(true);
    const query = rawQuery.toLowerCase().replace(/^[#>@]/, "");
    console.log(query)
    
    var categories =
      (rawQuery === "@" || query === "")
        ? categoryFilter
        : categoryFilter.filter((project:any) =>
            project.name.toLowerCase().includes(query)
        );

    var posts =
      (rawQuery === "#" || query === "")
        ? initPost
        : initPost.filter((post:any) =>
            post.posttitle.includes(query)
        );

    if(rawQuery.startsWith("@")){
      if(categories.length === 0) {
        categories = await fetchCat(query);
      }

      setfilteredCategories(categories);
      setfilteredPosts([]);
    }else if(rawQuery.startsWith("#")){
      if(posts.length === 0) {
        posts = await fetchPost(query);
      }

      setfilteredPosts(posts);
      setfilteredCategories([]);
    }else {
      if(categories.length === 0) {
        categories = await fetchCat(query);
      }
      
      if(posts.length === 0) {
        posts = await fetchPost(query);
      }

      setfilteredCategories(categories);
      setfilteredPosts(posts);
    }
    setLoading(false);
  }

  return (
    <>
      <div onClick={() => setOpen(true)} className="cursor-pointer">
        {renderTrigger ? (
          renderTrigger()
        ) : (
          <button className="flex w-10 h-10 sm:w-12 sm:h-12 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none items-center justify-center">
            <svg
              width={22}
              height={22}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22 22L20 20"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>

      <Transition.Root
        show={open}
        as={Fragment}
        afterLeave={() => {
          setfilteredCategories([]);
          setfilteredPosts([]);
        }}
        appear
      >
        <Dialog
          as="div"
          className="relative z-[99]"
          onClose={() => setOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-100"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-100"
            >
              <Dialog.Panel
                className="block mx-auto max-w-2xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all"
                as="form"
                onSubmit={(e) => e.preventDefault()}
              >
                <Combobox
                  onChange={(item: any) => {
                    router.push(item.href);
                    setOpen(false);
                  }}
                  name="searchpallet"
                >
                  <div className="relative">
                    <MagnifyingGlassIcon
                      className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <Combobox.Input
                      className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                      placeholder="Search..."
                      
                      onKeyDown={(e) => e.key === "Enter" && search(e)}
                      onChange={(e) => {
                        setfilteredCategories([])
                        setfilteredPosts([])
                        setnoData(false)
                        setRawQuery(e.target.value)
                      }}
                    />
                  </div>

                  {loading === true ? 
                    <div className="mb-10">
                      <Loading />
                    </div>
                  : (filteredCategories.length > 0 ||
                    filteredPosts.length > 0) && (
                    <Combobox.Options
                      static
                      className="max-h-80 scroll-py-10 scroll-pb-2 space-y-4 overflow-y-auto p-4 pb-2"
                    >
                      {filteredPosts.length > 0 && (
                        <li>
                          <h2 className="text-xs font-semibold text-gray-900">
                            Posts
                          </h2>
                          <ul className="-mx-4 mt-2 text-sm text-gray-700">
                            {filteredPosts.map((post:any) => (
                              <Combobox.Option
                                key={post.id}
                                value={post}
                                className={({ active }) =>
                                  classNames(
                                    "flex select-none items-center px-4 py-2",
                                    active && "bg-indigo-600 text-white"
                                  )
                                }
                              >
                                {({ active }) => (
                                  <>
                                    <MagnifyingGlassIcon
                                      className={classNames(
                                        "h-6 w-6 flex-none",
                                        active ? "text-white" : "text-gray-400"
                                      )}
                                      aria-hidden="true"
                                    />
                                    <span className="ml-3 flex-auto truncate">
                                      {post.posttitle}
                                    </span>
                                  </>
                                )}
                              </Combobox.Option>
                            ))}
                          </ul>
                        </li>
                      )}

                      {filteredCategories.length > 0 && (
                        <li>
                          <h2 className="text-xs font-semibold text-gray-900">
                            Categories
                          </h2>
                          <ul className="-mx-4 mt-2 text-sm text-gray-700">
                            {filteredCategories.map((project:any) => (
                              <Combobox.Option
                                key={project.id}
                                value={project}
                                className={({ active }) =>
                                  classNames(
                                    "flex select-none items-center px-4 py-2",
                                    active && "bg-indigo-600 text-white"
                                  )
                                }
                              >
                                {({ active }) => (
                                  <>
                                    <FolderIcon
                                      className={classNames(
                                        "h-6 w-6 flex-none",
                                        active ? "text-white" : "text-gray-400"
                                      )}
                                      aria-hidden="true"
                                    />
                                    <span className="ml-3 flex-auto truncate">
                                      {project.name}
                                    </span>
                                  </>
                                )}
                              </Combobox.Option>
                            ))}
                          </ul>
                        </li>
                      )}
                    </Combobox.Options>
                  )}

                  { loading === false && noData === true && (
                      <div className="py-14 px-6 text-center text-sm sm:px-14">
                        <ExclamationTriangleIcon
                          className="mx-auto h-6 w-6 text-gray-400"
                          aria-hidden="true"
                        />
                        <p className="mt-4 font-semibold text-gray-900">
                          No results found
                        </p>
                        <p className="mt-2 text-gray-500">
                          We couldn’t find anything with that term. Please try
                          again.
                        </p>
                      </div>
                    )}

                  <div className="flex flex-wrap items-center bg-gray-50 py-2.5 px-4 text-xs text-gray-700">
                    Type{" "}
                    <kbd
                      className={classNames(
                        "mx-1 flex h-5 w-5 items-center justify-center rounded border bg-white font-semibold sm:mx-2",
                        rawQuery.startsWith("#")
                          ? "border-indigo-600 text-indigo-600"
                          : "border-gray-400 text-gray-900"
                      )}
                    >
                      #
                    </kbd>{" "}
                    <span className="sm:hidden">for Posts,</span>
                    <span className="hidden sm:inline">
                      to access posts,
                    </span>
                    <kbd
                      className={classNames(
                        "mx-1 flex h-5 w-5 items-center justify-center rounded border bg-white font-semibold sm:mx-2",
                        rawQuery === "?"
                          ? "border-indigo-600 text-indigo-600"
                          : "border-gray-400 text-gray-900"
                      )}
                    >
                      @
                    </kbd>{" "}
                    for category, &{" "}
                    <kbd
                      className="mx-1 flex h-5 px-1.5 items-center justify-center rounded border bg-white sm:mx-2 border-primary-6000 text-neutral-900"
                    >
                      Press Enter to search
                    </kbd>{" "}
                  </div>
                </Combobox>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default SearchModal;
