This follows Next.js 15.7 conventions where:
Route groups (folder) are used when we don't want the folder name in the URL
Regular folders are used when we want them in the URL path
Dynamic segments [folder] are used for dynamic routes
The key difference is that the user dashboard should be a real URL path (/dashboard), not a route group, because we want users to access it at that specific URL.
Try refreshing your app - the routing conflict should be resolved now. Let me know if you'd like me to explain any part of this in more detail!