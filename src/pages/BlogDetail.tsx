import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, User, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import PageShell from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getBlogById } from "@/lib/api";
import { useState } from "react";

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [activeImage, setActiveImage] = useState(0);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["blog", id],
    queryFn: () => getBlogById(id!),
    enabled: !!id,
  });

  const blog = data?.blog;

  const handlePrevImage = () => {
    if (!blog) return;
    setActiveImage((prev) => (prev === 0 ? blog.images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    if (!blog) return;
    setActiveImage((prev) => (prev === blog.images.length - 1 ? 0 : prev + 1));
  };

  return (
    <PageShell>
      <section className="container mx-auto pb-24 px-4 max-w-4xl">
        {/* Back link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Blog
        </Link>

        {/* Loading state */}
        {isLoading && (
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-2/3 rounded shimmer" />
            <div className="flex gap-4">
              <div className="h-4 w-32 rounded shimmer" />
              <div className="h-4 w-24 rounded shimmer" />
            </div>
            <div className="rounded-3xl aspect-[16/9] shimmer" />
            <div className="space-y-3">
              <div className="h-4 w-full rounded shimmer" />
              <div className="h-4 w-full rounded shimmer" />
              <div className="h-4 w-3/4 rounded shimmer" />
              <div className="h-4 w-full rounded shimmer" />
              <div className="h-4 w-5/6 rounded shimmer" />
            </div>
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg mb-4">
              Unable to load this blog post.
            </p>
            <Link to="/blog">
              <Button variant="outline" className="rounded-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go back to Blog
              </Button>
            </Link>
          </div>
        )}

        {/* Blog content */}
        {!isLoading && !isError && blog && (
          <article className="animate-fade-in">
            {/* Title */}
            <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl mb-6 text-balance leading-tight">
              {blog.title}
            </h1>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formatDate(blog.createdAt)}
              </span>
              {typeof blog.createdBy === "object" && blog.createdBy?.name && (
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {blog.createdBy.name}
                </span>
              )}
            </div>

            {/* Image gallery */}
            {blog.images && blog.images.length > 0 && (
              <div className="mb-10">
                {/* Main image */}
                <div className="relative overflow-hidden rounded-3xl aspect-[16/9] mb-4 bg-muted">
                  <img
                    src={blog.images[activeImage]}
                    alt={`${blog.title} - Image ${activeImage + 1}`}
                    className="w-full h-full object-cover transition-opacity duration-500"
                  />
                  {/* Navigation arrows */}
                  {blog.images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background transition-colors shadow-md"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background transition-colors shadow-md"
                        aria-label="Next image"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {blog.images.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveImage(idx)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              idx === activeImage
                                ? "bg-white w-6"
                                : "bg-white/50 hover:bg-white/75"
                            }`}
                            aria-label={`View image ${idx + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnail strip */}
                {blog.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {blog.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImage(idx)}
                        className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all duration-300 ${
                          idx === activeImage
                            ? "ring-2 ring-primary opacity-100"
                            : "opacity-50 hover:opacity-80"
                        }`}
                      >
                        <img
                          src={img}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Blog description/content */}
            <div className="prose prose-lg max-w-none">
              <div
                className="text-foreground leading-relaxed text-base md:text-lg whitespace-pre-wrap"
                style={{ lineHeight: "1.8" }}
              >
                {blog.description}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link to="/blog">
                <Button variant="outline" className="rounded-full group/btn">
                  <ArrowLeft className="mr-2 h-4 w-4 group-hover/btn:-translate-x-1 transition-transform" />
                  Back to all posts
                </Button>
              </Link>
              {typeof blog.createdBy === "object" && blog.createdBy?.name && (
                <p className="text-sm text-muted-foreground">
                  Written by <span className="font-medium text-foreground">{blog.createdBy.name}</span>
                </p>
              )}
            </div>
          </article>
        )}
      </section>
    </PageShell>
  );
};

export default BlogDetail;
