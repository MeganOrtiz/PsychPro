import { useEffect } from "react";
import { useLocation } from "wouter";

// Permanent redirect from the legacy /feature-request route to the new
// structured Featured Work tab. Kept around so any bookmarks (or shared
// links from before task #66 shipped) still land in the right place.
export default function FeatureRequestRedirect() {
  const [, navigate] = useLocation();
  useEffect(() => {
    navigate("/featured-work", { replace: true });
  }, [navigate]);
  return null;
}
