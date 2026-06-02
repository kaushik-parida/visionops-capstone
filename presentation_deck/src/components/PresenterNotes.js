export const SLIDE_NOTES = {
  0: { say: "Welcome to our Technical Capstone Defense for the VisionOps Platform.", why: "Sets a professional tone.", q: "What is the scope of this capstone?" },
  1: { say: "The problem we are solving: traditional CCTV is passive. Humans suffer cognitive fatigue, leading to missed events and reactive forensic analysis.", why: "Establishes the business problem.", q: "Why not just hire more security guards?" },
  2: { say: "Our objectives are four-fold: Edge ML, Automated Rules, High-Performance UI, and Ephemeral Storage.", why: "Shows structured project goals.", q: "Why focus on Edge ML over Cloud?" },
  3: { say: "This is how business value flows through the system. We ingest raw visual data from the facility, apply our ML Detection and Rule layers, and output Operational Intelligence.", why: "Proves that technology serves a business purpose.", q: "Where does the data originate?" },
  4: { say: "This is our Runtime System Architecture. The React browser UI is isolated from the FastAPI inference engine via a RESTful HTTP boundary.", why: "Shows separation of concerns between UI and ML.", q: "Why did you separate the Event Feed from the Detection Service?" },
  5: { say: "Here is the lifecycle of a single video frame. We compress the frame via the Canvas API before it hits the backend, saving massive network bandwidth.", why: "Demonstrates data transformation at every step.", q: "What is the payload size of a single frame?" },
  6: { say: "Our Frontend Component Architecture. The App Shell handles routing, while the Shared Context acts as the single source of truth for the event feed.", why: "Defends React state management.", q: "Why did you build custom modules instead of a monolithic view?" },
  7: { say: "The Backend Component Architecture. The API Gateway routes the image blob to the Detection Service, which queries the Singleton Inference Engine, keeping RAM usage low.", why: "Defends FastAPI and Python memory management.", q: "How does the Inference Engine handle concurrent requests?" },
  8: { say: "This is our State Management flow. The Detection Results enter the Context Provider, which executes the threshold logic before pushing to the 50-Event History Store.", why: "Proves understanding of unidirectional data flow.", q: "Why execute rules on the client instead of the server?" },
  9: { say: "We selected React because the Virtual DOM can handle bounding box recalculations 30 times a second. Angular's two-way binding would introduce severe layout thrashing.", why: "Defends React against enterprise alternatives.", q: "Why not use Vue.js?" },
  10: { say: "We selected FastAPI for its ASGI concurrency. A 100ms OpenCV inference blocks the thread; FastAPI handles incoming HTTP requests while waiting for the CPU to free up.", why: "Defends FastAPI against Flask/Django.", q: "Could Node.js have handled the ML inference?" },
  11: { say: "We use SQLite for the PoC to achieve zero-configuration edge persistence. It runs entirely on isolated corporate networks without DB clusters.", why: "Defends SQLite over enterprise databases.", q: "How does SQLite handle concurrent writes?" },
  12: { say: "This is our ML Model Comparison Matrix. We rejected YOLOv8 because it requires a dedicated GPU to achieve <300ms latency. SSD MobileNet achieves 85ms on a standard CPU.", why: "The most important slide. Defends the ML model choice.", q: "Why didn't you use TensorRT for edge acceleration?" },
  13: { say: "Our biggest engineering challenge was UI Thread Freezing. We fixed this by decoupling the Canvas loop using async requestAnimationFrame.", why: "Proves debugging maturity.", q: "What happens if a network request hangs?" },
  14: { say: "A known machine learning edge case: the model extracts identical contours for a mouse and a phone. We mitigate this using Rule Density filtering.", why: "Shows transparency and system-level mitigation of ML flaws.", q: "How do you handle occluded objects?" },
  15: { say: "Our measured performance metrics: 85ms inference latency, 12 FPS pipeline, and 850 MB memory footprint per container.", why: "Provides hard numbers rather than estimates.", q: "Where is the bottleneck holding you back from 30 FPS?" },
  16: { say: "Before the live demo, this is the exact flow you will see: Frame Capture, Inference, Detection, Event Rules, and Investigation.", why: "Prepares the ARB for the demonstration.", q: "Is the demo running locally or in the cloud?" },
  17: { say: "This is our Production Scale Architecture. To handle multi-camera streaming, we will migrate from HTTP polling to Kafka Event Streams and AWS Fargate GPU nodes.", why: "Shows how the PoC maps to a true enterprise deployment.", q: "Why Kafka over RabbitMQ?" },
  18: { say: "Our roadmap includes training a custom office dataset to eliminate false positives and integrating Predictive Risk Analytics.", why: "Shows long-term product vision.", q: "How much data is required to fine-tune the model?" },
  19: { say: "VisionOps successfully transitions organizations from raw Object Detection to actionable Operational Intelligence.", why: "Strong closing statement.", q: "What is the biggest risk to this project?" }
};

export const SME_QUESTIONS = [
  {
    category: "Architecture & Component Design",
    questions: [
      { q: "Why did you choose a decoupled architecture instead of a monolith?", a: "Isolates the heavy ML inference workload from the UI rendering thread, preventing the browser from locking up. It also allows independent horizontal scaling of the backend API." },
      { q: "Why didn't you use Microservices?", a: "Microservices introduce network latency and deployment complexity. For this Edge PoC, a modular monolith (FastAPI) handles the load perfectly while remaining easy to deploy via a single Docker container." },
      { q: "Where does the source of truth live?", a: "In the PoC, React Context holds the ephemeral live state, and SQLite holds the historical state. In production, PostgreSQL will be the absolute source of truth." },
      { q: "Why use REST instead of WebSockets for the PoC?", a: "REST over HTTP is stateless and vastly simplifies the initial architecture. We mitigate the polling overhead using requestAnimationFrame. Phase 3 will upgrade to WebSockets for true bi-directional streaming." },
      { q: "What happens if the API Gateway goes down?", a: "The React frontend catches the fetch error, gracefully halts the requestAnimationFrame loop to prevent memory leaks, and renders a 'Connection Lost' banner to the operator." },
      { q: "How does the architecture handle concurrent users?", a: "The backend is completely stateless (REST). We can deploy identical FastAPI containers behind an NGINX reverse proxy to handle any number of concurrent operators." },
      { q: "Why separate the Rule Engine from the Detection Service?", a: "Separation of Concerns. Detection tells us *what* is in the frame (ML Layer). Rules tell us if we should *care* (Business Layer)." },
      { q: "How would you handle multi-tenant architecture?", a: "We would introduce a tenant_id to all PostgreSQL tables and enforce Row-Level Security (RLS) or logical database isolation per client." },
      { q: "Why is the backend completely stateless?", a: "To enable horizontal scaling without session affinity (sticky sessions) issues at the load balancer level." },
      { q: "What is the primary architectural driver for this project?", a: "Latency minimization. Every architectural decision (FastAPI, SSD MobileNet, REST vs Base64, Canvas extraction) was optimized to reduce the round-trip time from frame capture to UI event rendering." }
    ]
  },
  {
    category: "Frontend Engineering (React)",
    questions: [
      { q: "Why React over Angular?", a: "React's Virtual DOM is critical for rapidly updating bounding box overlays (12+ FPS) without triggering full DOM layout thrashing. Angular's two-way binding is too heavy for high-frequency continuous visual updates." },
      { q: "Why not use Vue.js?", a: "Vue is excellent, but React's massive ecosystem (Framer Motion, React Router) and the widespread availability of enterprise React engineers made it the safer choice for long-term maintainability." },
      { q: "How did you solve the Bounding Box scaling issue?", a: "The ML model returns absolute 640x480 coordinates. The UI uses getBoundingClientRect() to calculate ratio multipliers dynamically, mapping the boxes perfectly regardless of screen size." },
      { q: "Why Vite instead of Create React App (CRA)?", a: "Vite provides instant Hot Module Replacement (HMR) and uses esbuild (Go) for compilation, which is 10-100x faster than Webpack (CRA). CRA is also officially deprecated by the React team." },
      { q: "Why Tailwind instead of Styled Components?", a: "Tailwind generates static CSS classes at build time. Styled Components introduces runtime JavaScript overhead to parse CSS-in-JS, which we cannot afford during an active 12 FPS video stream." },
      { q: "How does the frontend handle dropped frames?", a: "We use requestAnimationFrame. It only requests the next frame when the previous HTTP POST resolves. If the backend slows down, the frontend naturally throttles itself, preventing a DDoS." },
      { q: "How do you render the video stream?", a: "We use the standard HTML5 <video> tag hooked into navigator.mediaDevices.getUserMedia() to access the local webcam." },
      { q: "Why is the Canvas element hidden?", a: "The user views the high-res 60 FPS video stream. We use a hidden 640x480 Canvas strictly to extract, downscale, and compress the frame for the API payload." },
      { q: "How are you handling routing?", a: "React Router DOM handles client-side routing, allowing operators to switch between Monitoring and Analytics without dropping the active WebRTC camera stream." },
      { q: "How do you animate components without dropping frame rates?", a: "We use Framer Motion, which utilizes hardware-accelerated CSS transforms (translate3d, opacity) rather than manipulating DOM dimensions (width, top), which triggers expensive browser repaints." }
    ]
  },
  {
    category: "Backend Engineering (FastAPI)",
    questions: [
      { q: "Why FastAPI instead of Flask?", a: "Object detection is I/O heavy. FastAPI's ASGI (Asynchronous Server Gateway Interface) allows concurrent request handling. Flask's WSGI blocks on synchronous ML calls, causing cascading latency." },
      { q: "Why not Django?", a: "Django is a massive monolith. We do not need an ORM, a templating engine, or an admin panel for a pure high-throughput ML inference endpoint." },
      { q: "Could Node.js have handled the ML inference?", a: "Node.js is fantastic for I/O, but Python has a near-monopoly on ML libraries (TensorFlow, PyTorch, OpenCV). Bridging Node to Python ML scripts introduces unacceptable IPC overhead." },
      { q: "How do you manage CORS?", a: "FastAPI CORSMiddleware is strictly configured to only allow requests from the React origin, preventing cross-site hijacking of the inference endpoint." },
      { q: "How are images transmitted to the backend?", a: "The frontend sends raw binary (multipart/form-data) via Blobs. We do NOT use Base64 encoding, which bloats the payload by 33% and wastes CPU cycles decoding it." },
      { q: "How do you load the ML model?", a: "Singleton pattern. The TensorFlow frozen graph is loaded into RAM once during the FastAPI startup event. It remains in memory for all subsequent requests, eliminating cold-start penalties." },
      { q: "How does FastAPI read the image?", a: "It reads the binary payload directly into memory using UploadFile.read(), converts it to a NumPy array, and passes it to OpenCV. No disk I/O occurs." },
      { q: "Is the Python GIL (Global Interpreter Lock) an issue?", a: "No. OpenCV DNN is written in C++ and releases the GIL during the heavy forward pass, allowing other FastAPI threads to handle incoming HTTP requests." },
      { q: "How do you handle API versioning?", a: "We use strict URL path versioning (e.g., /api/v1/detect) to ensure backward compatibility for edge clients if the API contract changes." },
      { q: "What web server runs FastAPI in production?", a: "Uvicorn, an ASGI web server implementation, often placed behind NGINX acting as a reverse proxy for TLS termination." }
    ]
  },
  {
    category: "State Management & Data Flow",
    questions: [
      { q: "Why use Context API instead of Redux?", a: "Redux introduces massive boilerplate (actions, reducers, dispatchers). Our state mutation is simple (append event, clear events), making Context API the cleaner choice." },
      { q: "How do you prevent Context API from causing unnecessary re-renders?", a: "We split the Context into multiple providers (e.g., EventHistoryContext vs LiveDetectionContext) so that components only subscribe to the specific data they need." },
      { q: "Where does the Rule Engine execute?", a: "Currently on the client-side inside the Context Provider to save server CPU cycles. In Phase 3, this moves to the backend Event Processor." },
      { q: "How large is the Event History array?", a: "It is a rolling array capped at 50 events using a FIFO (First-In, First-Out) method to prevent browser memory bloat." },
      { q: "How do you sync state if the user refreshes?", a: "Currently, state is ephemeral in RAM. In production, React will fetch the last 50 events from PostgreSQL on mount." },
      { q: "How is data serialized between backend and frontend?", a: "Standard JSON over HTTP. The backend explicitly formats OpenCV output into a structured JSON array: [{ class: 'person', confidence: 0.85, box: [...] }]." },
      { q: "Why calculate rule thresholds on the frontend?", a: "It reduces the API response payload. The backend simply returns the raw bounding boxes, and the React client determines if '3 phones' violates the specific room's policy." },
      { q: "How do you handle rapid sequential events (e.g. flickering detections)?", a: "We implement a software debounce in the Rule Engine. An event must be detected consistently for N frames before it triggers an alert." },
      { q: "What happens to snapshots?", a: "The Canvas Blob is converted to an ObjectURL and stored in the React state for immediate review in the Investigation module." },
      { q: "How does the user export data?", a: "The Context API maps the JSON event array into CSV format, creates a Blob, and triggers an anchor tag download directly in the browser." }
    ]
  },
  {
    category: "Machine Learning & Object Detection",
    questions: [
      { q: "Why SSD MobileNet V2 over YOLOv8?", a: "SSD MobileNet achieves ~85ms inference on standard CPUs. YOLOv8 requires >300ms on CPU or a dedicated GPU. We optimized for edge CPU deployment." },
      { q: "Why not use Faster R-CNN?", a: "Faster R-CNN provides higher mAP (accuracy) but suffers from massive latency (>500ms on CPU), making it completely useless for real-time video." },
      { q: "What dataset was the model trained on?", a: "COCO (Common Objects in Context), which supports 91 generic classes (Person, Laptop, Cell Phone, etc.)." },
      { q: "Why does the model confuse mice with cell phones?", a: "At 640x480 resolution, a black wireless mouse shares identical pixel contours with a smartphone. This is an optical ambiguity flaw inherent to generic datasets." },
      { q: "How do you mitigate false positives?", a: "Rule Density. We configure the system to only alert if >3 phones are detected, mathematically filtering out stray optical illusions." },
      { q: "How does the system handle reflections in glass?", a: "The COCO model lacks 3D depth perception. Reflected persons are detected. We mitigate this using Spatial Masking (polygon exclusion zones)." },
      { q: "What is your confidence threshold?", a: "We set the ML threshold low (e.g., 20%) to prioritize recall (catching everything), and let the Business Logic (Rule Engine) filter out the noise." },
      { q: "Can this model recognize specific employees?", a: "No. COCO detects generic classes. Facial recognition requires a secondary biometric pipeline (e.g., FaceNet) which has massive legal implications." },
      { q: "What happens in low light?", a: "Confidence drops rapidly as contrast decreases. Production systems use Infrared (IR) cameras and models explicitly fine-tuned on IR datasets." },
      { q: "How does occlusion affect the system?", a: "If a person is 50% hidden behind a desk, confidence drops. We use Non-Maximum Suppression (NMS) to clean up overlapping, fragmented boxes." }
    ]
  },
  {
    category: "Model Inference & OpenCV",
    questions: [
      { q: "Why resize to 300x300 for inference?", a: "MobileNet's architecture expects 300x300 tensors. Larger resolutions drastically increase CPU computation time without proportional accuracy gains." },
      { q: "What does OpenCV DNN actually do?", a: "It parses the pre-trained TensorFlow frozen graph (.pb) and executes the forward pass (inference) highly efficiently using C++ under the hood." },
      { q: "What is the output of the inference?", a: "A 4D tensor matrix containing the detected class IDs, confidence scores, and relative bounding box coordinates (0.0 to 1.0)." },
      { q: "Why multiply the coordinates by width/height?", a: "The model outputs relative coordinates (e.g., 0.5 x, 0.5 y). We must multiply these by the frame dimensions (640x480) to get absolute pixel locations." },
      { q: "Why is Non-Maximum Suppression (NMS) necessary?", a: "Object detectors often predict multiple overlapping boxes for a single object. NMS removes redundant boxes that have high Intersection-over-Union (IoU) overlap." },
      { q: "How do you handle color spaces?", a: "OpenCV uses BGR by default, but the web Canvas uses RGB. We must use cv2.cvtColor(img, cv2.COLOR_RGB2BGR) before feeding it to the model." },
      { q: "What is the blobFromImage function?", a: "It performs mean subtraction, scaling, and channel swapping to prepare the raw image matrix into the exact tensor format the neural network expects." },
      { q: "Why didn't you use TensorFlow.js in the browser?", a: "TF.js is viable, but offloading to FastAPI allows us to eventually leverage server-side GPUs (CUDA) without rewriting the core inference logic." },
      { q: "What is the difference between the .pb and .pbtxt files?", a: "The .pb file contains the frozen binary neural network weights. The .pbtxt file contains the human-readable text graph defining the network architecture." },
      { q: "How do you measure engine latency?", a: "We wrap the cv2.dnn.forward() call in Python's time.time() to measure the exact milliseconds the CPU spends calculating the inference." }
    ]
  },
  {
    category: "Databases & Persistence",
    questions: [
      { q: "Why did you select SQLite?", a: "SQLite is a zero-configuration, serverless database. It allows the PoC to run entirely on isolated corporate LANs without spinning up DB clusters." },
      { q: "When will you migrate to PostgreSQL?", a: "Phase 4 (Cloud Migration). PostgreSQL is mandatory when we move from single-edge deployments to centralized multi-tenant event warehouses." },
      { q: "How do you prevent SQLite from locking up?", a: "We use Write-Ahead Logging (WAL) mode in SQLite, which allows concurrent readers while a write is occurring." },
      { q: "How do you prevent the DB from growing too large?", a: "Implementing a FIFO retention policy via a CRON job that automatically prunes events older than 30 days." },
      { q: "Why not use MongoDB?", a: "Event history is highly structured (Timestamp, Class, Confidence, Rule Triggered). Relational databases are better suited for this schema than document stores." },
      { q: "How are snapshots stored?", a: "Currently in browser RAM. In production, binary images will be uploaded to AWS S3, and the S3 URL will be stored in the SQL database." },
      { q: "How do you handle schema migrations?", a: "For the PoC, we manually create tables. For production, we will use a migration tool like Alembic (Python) to version control schema changes." },
      { q: "How do you query the event history?", a: "Via a REST GET endpoint that supports query parameters for pagination, date ranges, and severity filtering." },
      { q: "What happens if the disk fills up?", a: "The SQLite insertion will throw an IOError. The FastAPI backend must catch this, log a critical alert, and gracefully reject new events." },
      { q: "How is database security handled at the edge?", a: "The SQLite file must be stored on an encrypted volume (e.g., BitLocker/LUKS) to protect historical security event data if the hardware is stolen." }
    ]
  },
  {
    category: "Deployment & Scalability",
    questions: [
      { q: "How will you handle multi-camera streaming?", a: "HTTP polling will break. We must migrate to RTSP streams ingested by Kafka or RabbitMQ, with distributed GPU worker nodes." },
      { q: "How do you deploy the frontend?", a: "Compiled to static HTML/JS/CSS via Vite and hosted on a CDN (AWS CloudFront, Vercel, or NGINX)." },
      { q: "How do you deploy the backend?", a: "Containerized via Docker. For edge, deployed via Docker Compose. For cloud, deployed via Kubernetes (EKS)." },
      { q: "How does the backend scale horizontally?", a: "Since it is strictly stateless, we can deploy 10 FastAPI containers behind an AWS Application Load Balancer (ALB)." },
      { q: "What is the bottleneck for scaling?", a: "CPU Inference. To scale past 15 FPS, we must move to hardware acceleration (AWS Fargate GPUs, Google Coral Edge TPUs, or NVIDIA Jetson Nano)." },
      { q: "What is your CI/CD strategy?", a: "GitHub Actions. Upon merge to main, run PyTest/Vitest, build the Docker image, push to AWS ECR, and trigger an ECS rolling update." },
      { q: "Why Kafka over RabbitMQ?", a: "Kafka provides distributed event streaming with high throughput and event replayability, which is critical for ingesting thousands of concurrent video frames." },
      { q: "How do you handle environment variables?", a: "We use .env files locally and inject secrets via AWS Secrets Manager in production, ensuring API keys are never committed to GitHub." },
      { q: "How do you deploy updates to edge devices?", a: "Using IoT fleet management tools (e.g., AWS IoT Greengrass or Balena) to push new Docker images over-the-air (OTA)." },
      { q: "What is the cost of running this in the cloud?", a: "Running continuous 24/7 GPU inference (e.g., AWS EC2 g4dn) is extremely expensive. Hybrid edge-cloud architectures push inference to the edge and only send metadata to the cloud." }
    ]
  },
  {
    category: "Security, Monitoring & Compliance",
    questions: [
      { q: "How do you secure the API?", a: "Production requires JWT (JSON Web Tokens) for authentication, Role-Based Access Control (RBAC), and strict CORS policies." },
      { q: "How is data encrypted in transit?", a: "All API traffic must be forced over HTTPS/TLS 1.3 using SSL certificates managed by AWS ACM or Let's Encrypt." },
      { q: "What about employee privacy and GDPR?", a: "Inference happens on the edge. Raw video never hits the cloud. Only text metadata ('Person detected') is transmitted, preserving privacy." },
      { q: "How do you handle audit logging?", a: "All configuration changes (e.g., lowering thresholds) must be logged with a timestamp and User ID to a secure PostgreSQL table to satisfy SOC2 compliance." },
      { q: "How do you prevent DDoS attacks on the inference endpoint?", a: "API Gateways (e.g., AWS API Gateway or NGINX) must implement strict rate-limiting (e.g., 30 requests/sec per IP) to prevent CPU exhaustion." },
      { q: "How do you monitor system health?", a: "Integrate with Datadog or Prometheus/Grafana to track inference latency, 500 error rates, and CPU/RAM utilization in real-time." },
      { q: "How do you handle unauthorized physical access?", a: "If the edge device is stolen, the encrypted disk volumes (LUKS) prevent the extraction of the SQLite database and proprietary ML weights." },
      { q: "How do you secure the WebSocket connection?", a: "Using WSS (WebSocket Secure), enforcing JWT token validation during the initial HTTP handshake." },
      { q: "What happens if an API token is leaked?", a: "Tokens should have short lifespans (e.g., 15 minutes) and rely on refresh tokens. We can revoke the user's access in the database, invalidating the next refresh." },
      { q: "Is the frontend code secure?", a: "React prevents standard XSS (Cross-Site Scripting) by automatically escaping strings. However, business logic is exposed to the client, which is why the backend must validate all requests." }
    ]
  },
  {
    category: "Future Roadmap & Limitations",
    questions: [
      { q: "Why fine-tune a custom dataset?", a: "COCO is too generic. We need to train the model to accurately differentiate 'Laptops' from 'Keyboards' from extreme overhead security camera angles." },
      { q: "What is Predictive Risk Analytics?", a: "Using historical event data (PostgreSQL) to forecast risk (e.g., 'Server Room 4 has a 80% higher chance of unauthorized access on Friday nights')." },
      { q: "How does this integrate with Digital Twins?", a: "Mapping 2D camera coordinates into a 3D architectural model (e.g., Unreal Engine) to track physical asset movement through a facility in real-time." },
      { q: "How would you monetize this?", a: "B2B SaaS model. Base platform fee + per-camera ingestion fee + premium predictive analytics tier." },
      { q: "What is the biggest risk to this project?", a: "Hardware costs. If we cannot maintain <100ms latency on cheap edge CPUs, the cost of deploying NVIDIA GPUs to every facility breaks the business model." },
      { q: "How does this reduce costs for TEKsystems?", a: "Reduces the headcount required for physical security monitoring by acting as a force multiplier for existing SOC teams." },
      { q: "Can this be used for Health & Safety (OSHA)?", a: "Yes. With a fine-tuned dataset, we can detect missing hardhats, safety vests, or forklift proximity violations." },
      { q: "What is the limitation of the current bounding box logic?", a: "It only tracks spatial location, not object identity across frames. Phase 3 requires integrating an Object Tracker (e.g., DeepSORT) to assign unique IDs to moving objects." },
      { q: "How do you handle false negatives?", a: "False negatives (missing a threat) are worse than false positives (annoying alerts). We tune the confidence threshold aggressively low and rely on the Rule Engine to filter." },
      { q: "What is the next immediate architectural step?", a: "Ripping out the requestAnimationFrame HTTP polling loop and replacing it with a continuous WebRTC video stream and WebSocket metadata channel." }
    ]
  }
];

export const CODE_EXPLANATION = [
  {
    module: "React App Shell (src/App.jsx)",
    purpose: "The entry point and routing manager for the frontend.",
    dependencies: "React Router, Framer Motion, Context API",
    files: [
      { name: "App.jsx", role: "Wraps the application in IntelligenceProvider. Manages the client-side routes (/, /monitoring, /analytics, /config)." }
    ],
    flow: [
      "1. React boots and mounts App.jsx.",
      "2. IntelligenceProvider initializes global state.",
      "3. Router renders the specific page component based on the URL."
    ]
  },
  {
    module: "Context API State (src/context/IntelligenceContext.jsx)",
    purpose: "The Global Source of Truth for events and metrics.",
    dependencies: "React (useState, useEffect, createContext)",
    files: [
      { name: "IntelligenceContext.jsx", role: "Holds eventHistory (Array), latestDetections (Array), and systemMetrics (Object)." }
    ],
    flow: [
      "1. Monitoring component dispatches detection results to Context.",
      "2. Context applies the Event Rules (e.g., IF persons > 8 THEN alert).",
      "3. If a rule is triggered, the event is prepended to eventHistory.",
      "4. The Investigation page automatically re-renders to show the new data."
    ]
  },
  {
    module: "Monitoring Loop (src/pages/LiveMonitoring.jsx)",
    purpose: "The asynchronous ML extraction engine.",
    dependencies: "WebRTC (getUserMedia), Canvas API, Fetch API",
    files: [
      { name: "LiveMonitoring.jsx", role: "Manages the webcam and executes the requestAnimationFrame loop." }
    ],
    flow: [
      "1. WebRTC connects to the webcam and streams to a <video> element.",
      "2. requestAnimationFrame calls captureFrame().",
      "3. The frame is drawn to a hidden Canvas and converted to a Blob.",
      "4. fetch() POSTs the Blob to FastAPI.",
      "5. ONLY when the fetch() resolves does the loop request the next frame."
    ]
  },
  {
    module: "FastAPI Gateway (backend/app.py)",
    purpose: "The high-throughput ASGI entry point.",
    dependencies: "FastAPI, Uvicorn, CORS Middleware",
    files: [
      { name: "app.py", role: "Defines the /api/detect route and manages the async request lifecycle." }
    ],
    flow: [
      "1. /api/detect receives the multipart/form-data Blob.",
      "2. UploadFile.read() loads the binary directly into RAM.",
      "3. Converts binary to a NumPy array via cv2.imdecode().",
      "4. Passes the array to the ObjectDetector singleton.",
      "5. Returns the JSON response to React."
    ]
  },
  {
    module: "Inference Engine (backend/model.py)",
    purpose: "The Singleton ML processor.",
    dependencies: "OpenCV (cv2.dnn), NumPy",
    files: [
      { name: "model.py", role: "Loads the TensorFlow graph and executes the forward pass." }
    ],
    flow: [
      "1. Constructor loads weights (.pb) and config (.pbtxt) into RAM once.",
      "2. detect() receives the NumPy array.",
      "3. cv2.dnn.blobFromImage() normalizes and resizes the tensor to 300x300.",
      "4. net.forward() executes the C++ inference pass on the CPU.",
      "5. Extracts class IDs, filters by confidence, and maps bounding box coordinates."
    ]
  }
];
