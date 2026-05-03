import { Link } from "react-router-dom";
import { Calendar, ArrowRight, Loader2 } from "lucide-react";
import PageShell from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getBlogs, type PublicBlog } from "@/lib/api";

const BlogSkeleton = () => (
  <div className="animate-pulse">
    <div className="rounded-2xl aspect-[4/3] mb-4 shimmer" />
    <div className="h-5 w-3/4 rounded shimmer mb-2" />
    <div className="h-4 w-full rounded shimmer mb-1" />
    <div className="h-4 w-2/3 rounded shimmer mb-3" />
    <div className="h-3 w-1/3 rounded shimmer" />
  </div>
);

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const Blog = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["blogs"],
    queryFn: getBlogs,
  });

  const blogs: PublicBlog[] = data?.blog?.filter((b) => b.isPublished) ?? [];
  const [feature, ...rest] = blogs;

  return (
    <PageShell
      title="Our Blog"
      eyebrow="Journal"
      subtitle="Stories, updates, and inspiration from BugyBoo."
    >
      <section className="container mx-auto pb-24 px-4">
        {isLoading && (
          <>
            {/* Featured skeleton */}
            <div className="grid md:grid-cols-2 gap-8 items-center mb-16 animate-pulse">
              <div className="rounded-3xl aspect-[4/3] shimmer" />
              <div>
                <div className="h-4 w-20 rounded shimmer mb-3" />
                <div className="h-10 w-3/4 rounded shimmer mb-4" />
                <div className="h-4 w-full rounded shimmer mb-2" />
                <div className="h-4 w-2/3 rounded shimmer mb-6" />
                <div className="h-10 w-32 rounded-full shimmer" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <BlogSkeleton key={i} />
              ))}
            </div>
          </>
        )}

        {isError && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              Unable to load blogs. Please try again later.
            </p>
          </div>
        )}

        {!isLoading && !isError && blogs.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              No blog posts yet. Check back soon!
            </p>
          </div>
        )}

        {!isLoading && !isError && feature && (
          <>
            {/* Featured post */}
            <Link to={`/blog/${feature._id}`} className="block group mb-16">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="relative overflow-hidden rounded-3xl aspect-[4/3]">
                  <img
                    src={feature.images?.[0] ?? ""}
                    alt={feature.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
                    Blog
                  </p>
                  <h2 className="font-serif text-3xl md:text-5xl mb-4 text-balance">
                    {feature.title}
                  </h2>
                  <p className="text-muted-foreground mb-6 line-clamp-3">
                    {feature.description}
                  </p>
                  <div className="flex items-center gap-5 text-xs text-muted-foreground mb-6">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" />
                      {formatDate(feature.createdAt)}
                    </span>
                    {typeof feature.createdBy === "object" && feature.createdBy?.name && (
                      <span>By {feature.createdBy.name}</span>
                    )}
                  </div>
                  <Button variant="outline" className="rounded-full group/btn">
                    Read Full Blog
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </Link>

            {/* Blog grid */}
            {rest.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {rest.map((blog, i) => (
                  <Link
                    key={blog._id}
                    to={`/blog/${blog._id}`}
                    className="group animate-fade-in"
                    style={{
                      animationDelay: `${i * 70}ms`,
                      animationFillMode: "backwards",
                    }}
                  >
                    <div className="relative overflow-hidden rounded-2xl aspect-[4/3] mb-4 hover-lift">
                      <img
                        src={blog.images?.[0] ?? ""}
                        alt={blog.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                    </div>
                    <h3 className="font-serif text-xl mb-2 leading-tight">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {blog.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{formatDate(blog.createdAt)}</span>
                      {typeof blog.createdBy === "object" && blog.createdBy?.name && (
                        <>
                          <span>·</span>
                          <span>{blog.createdBy.name}</span>
                        </>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </PageShell>
  );
};

export default Blog;
