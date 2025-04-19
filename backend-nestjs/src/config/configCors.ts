export const ConfigCors = {
    origin: [process.env.NEXT_PUBLIC_API_URL,"http://192.168.1.222"],
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    allowedHeaders: ['content-type', 'Authorization', 'Origin', 'Access-Control-Allow-Origin', 'Accept', 'Options', 'X-Requested-With'],
    exposedHeaders: ['Authorization'],
    credentials: true,
    optionsSuccessStatus: 200, 
} 