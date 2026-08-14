-- ============================================================
-- KVJ Analytics — Data Analytics Course Seed Migration
-- ============================================================

DELETE FROM public.courses WHERE slug = 'data-analytics';

INSERT INTO public.courses (id, slug, title, summary, duration, fee_inr, offer_price_inr, offer_label, is_locked, is_published, segment)
VALUES (
  '8d7e98a3-c40d-4876-8051-789a64f5da04',
  'data-analytics',
  'Data Analytics',
  'A comprehensive professional pathway covering spreadsheets, database query engines, visualization, governance, and visual dashboard building.',
  '12 Weeks',
  8999,
  4999,
  '44% OFF',
  false,
  true,
  'college'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  duration = EXCLUDED.duration,
  fee_inr = EXCLUDED.fee_inr,
  offer_price_inr = EXCLUDED.offer_price_inr,
  offer_label = EXCLUDED.offer_label,
  is_locked = EXCLUDED.is_locked,
  is_published = EXCLUDED.is_published,
  segment = EXCLUDED.segment;

INSERT INTO public.modules (id, course_id, title, display_order)
VALUES ('7a2e84cf-81b4-4e9b-a01c-6d9b3a0f7e01', '8d7e98a3-c40d-4876-8051-789a64f5da04', 'Module 1: Introduction to Data & Variables', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, display_order = EXCLUDED.display_order;
INSERT INTO public.modules (id, course_id, title, display_order)
VALUES ('7a2e84cf-81b4-4e9b-a01c-6d9b3a0f7e02', '8d7e98a3-c40d-4876-8051-789a64f5da04', 'Module 2: Spreadsheets & Modeling', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, display_order = EXCLUDED.display_order;
INSERT INTO public.modules (id, course_id, title, display_order)
VALUES ('7a2e84cf-81b4-4e9b-a01c-6d9b3a0f7e03', '8d7e98a3-c40d-4876-8051-789a64f5da04', 'Module 3: SQL & Databases', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, display_order = EXCLUDED.display_order;
INSERT INTO public.modules (id, course_id, title, display_order)
VALUES ('7a2e84cf-81b4-4e9b-a01c-6d9b3a0f7e04', '8d7e98a3-c40d-4876-8051-789a64f5da04', 'Module 4: Reporting & Data Visualization', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, display_order = EXCLUDED.display_order;
INSERT INTO public.modules (id, course_id, title, display_order)
VALUES ('7a2e84cf-81b4-4e9b-a01c-6d9b3a0f7e05', '8d7e98a3-c40d-4876-8051-789a64f5da04', 'Module 5: Data Governance, Compliance & Privacy', 5)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, display_order = EXCLUDED.display_order;

INSERT INTO public.lessons (id, module_id, title, kind, content_html, display_order)
VALUES (
  '1e92c4b7-5d03-49ef-b32f-7798ef1a4c01',
  '7a2e84cf-81b4-4e9b-a01c-6d9b3a0f7e01',
  'Introduction to Data & Variables - Textbook',
  'material',
  '<!-- KVJ_MATERIAL_METADATA: {"type":"document","blocks":[{"id":"tizhohv","type":"heading","text":"1.1 Data, Information and Knowledge"},{"id":"frg5x23","type":"subheading","text":"Data"},{"id":"kyypldm","type":"paragraph","text":"Data refers to raw facts, figures, or observations collected for analysis or reference. On its own, data is often meaningless because it lacks context."},{"id":"dbfvyji","type":"callout","title":"Examples of Data","points":["The number 42.","A list of dates: 12/05, 14/05, 19/05.","The word \"Cochin.\""]},{"id":"axmna7q","type":"paragraph","text":"Data can appear in many forms such as:"},{"id":"50y951i","type":"list","title":"","points":["Numbers","Text","Images","Audio"]},{"id":"a9j7sdd","type":"heading","text":"1.2 Information: The Finished Product"},{"id":"erqgur4","type":"paragraph","text":"Information is data that has been processed, structured, or presented within a specific context to make it meaningful and useful. It is \"data with a story.\""},{"id":"f3rraxv","type":"borderedtext","title":"Characteristics","text":"Processed, organized, and relevant to a goal."},{"id":"pju6hwo","type":"callout","title":"Examples of Information","points":["\"42\" is the number of students who passed the AI exam.","The dates represent a schedule for upcoming Python training sessions.","\"Cochin\" is the current location for a regional education tour."]},{"id":"18ezhpd","type":"subheading","text":"Key Differences at a Glance"},{"id":"k48uouj","type":"table","headers":["Feature","Data","Information"],"rows":[["Form","Raw, unorganized facts.","Organized and processed facts."],["Level","Low-level (the starting point).","High-level (the output)."],["Dependence","Independent of context.","Dependent on context."],["Meaning","Meaningless on its own.","Meaningful and actionable."],["Example","Individual test scores.","The average grade of a class."]]},{"id":"hq0jst2","type":"heading","text":"1.3 Knowledge: The Application of Information"},{"id":"f6kaukf","type":"paragraph","text":"While information is data with context, knowledge is the next step in the hierarchy. It is the ability to use information to make decisions, solve problems, or predict future outcomes. Knowledge is gained through experience, study, and reflection."},{"id":"43w0kwu","type":"borderedtext","title":"Characteristics","text":"Action-oriented, subjective, and cumulative.\r\n                \r\n                If information tells you what is happening, knowledge tells you how to use that information or why it matters."},{"id":"h830syc","type":"subheading","text":"Example Scenario: Educational Planning"},{"id":"e3y8ot0","type":"paragraph","text":"To see how these concepts build on one another, let''s look at a practical scenario involving educational planning:"},{"id":"fpxrqir","type":"subheading","text":"DATA The Raw Input"},{"id":"ha7ckyg","type":"paragraph","text":"A list of numbers. On their own, these are just digits without a purpose or context."},{"id":"ij4fvcw","type":"subheading","text":"INFORMATION The Processed Output"},{"id":"z6q77pu","type":"paragraph","text":"Python Mock Test Scores"},{"id":"03leck0","type":"paragraph","text":"Context applied. By adding meaning, we now know these are test results and can spot trends."},{"id":"jj59p33","type":"subheading","text":"KNOWLEDGE Insight & Action"},{"id":"032ee2s","type":"paragraph","text":"Root Cause: Struggling students missed the \"Loops\" session."},{"id":"4uvnyi6","type":"paragraph","text":"Using the information to identify a learning gap and taking strategic action before the final exam."},{"id":"doqx46a","type":"subheading","text":"Summary Comparison"},{"id":"yfcv5ac","type":"table","headers":["Concept","Simple Definition","Example"],"rows":[["Data","Symbols/Facts","\"32\""],["Information","Contextualized Data","\"32°C is the current temperature.\""],["Knowledge","Applied Information","\"At 32°C, I should wear light clothing to stay comfortable.\""]]},{"id":"gnhroam","type":"heading","text":"Practice Check"},{"id":"dy9lcq0","type":"assessment","title":"Practice Check","questions":[{"text":"Which of the following scenarios best illustrates the difference between data and information?","options":["A list of temperatures is information, while a chart showing them is data.","Random numbers are data, while knowing these represent daily sales is information.","A printed textbook is data, while a digital ebook is information.","Data is always numbers, while information is always words."],"correct":"1"}]},{"id":"l3sdi8h","type":"assessment","title":"Practice Check","questions":[{"text":"Which level of the hierarchy is characterized by being ''action-oriented'' and built through experience and reflection?","options":["Metadata","Information","Knowledge","Data"],"correct":"2"}]},{"id":"g1qlswz","type":"assessment","title":"Practice Check (True/False)","questions":[{"text":"Raw data is often meaningless on its own because it lacks context and organization.","options":["True","False"],"correct":"0"}]},{"id":"fgp0fzx","type":"assessment","title":"Practice Check (True/False)","questions":[{"text":"Information is the highest level of the hierarchy and represents the final stage of understanding.","options":["True","False"],"correct":"1"}]},{"id":"nr707dy","type":"assessment","title":"Practice Check (True/False)","questions":[{"text":"Summarizing a large spreadsheet of sales figures into a monthly growth chart is an example of creating knowledge.","options":["True","False"],"correct":"1"}]},{"id":"go99r4u","type":"heading","text":"1.4 Data Analysis"},{"id":"pmojzpp","type":"subheading","text":"Concept"},{"id":"y6kezty","type":"paragraph","text":"Data Analysis is the process of converting raw data into useful information for decision making. Organizations use data analysis to:"},{"id":"73ia6cb","type":"list","title":"","points":["Understand trends","Identify patterns","Support decisions"]},{"id":"i14swoh","type":"subheading","text":"Insight:"},{"id":"qfopwxv","type":"paragraph","text":"Data analysis answers questions like: What happened? Why did it happen? What might happen next?"},{"id":"223x62t","type":"subheading","text":"Example"},{"id":"t4td6gh","type":"paragraph","text":"Imagine a business tracking its monthly revenue. The raw numbers (Data) show a decline. By processing this (Information), the owner sees the decline is specific to one product line. This insight allows them to investigate the cause and make an informed decision (Data Analysis) to improve future performance."},{"id":"pf62mb4","type":"heading","text":"1.5 Data Variable Types"},{"id":"jdht4xk","type":"subheading","text":"1.5.1 Boolean Data Type"},{"id":"d2wi7gj","type":"paragraph","text":"The Boolean Data type is used to store only two possible values: True and False. In binary systems, these are represented by 1 (True) and 0 (False)."},{"id":"pn3e6uf","type":"borderedtext","title":"Core Concept","text":"Booleans represent a logical state. They cannot be added or subtracted like numbers because they only have two possible states: true or false."},{"id":"ffv7fj9","type":"paragraph","text":"Booleans are essential for comparisons, conditional statements, and logical operations that direct the flow of a program. Interestingly, Booleans are very efficient, usually requiring only one byte of memory compared to text variables which require much more."},{"id":"v1w3uyj","type":"borderedtext","title":"In Python","text":"Python represents these as True and False (note the capitalization). They are the foundation of if, elif, and else statements used to control program logic."},{"id":"bsn6ahc","type":"paragraph","text":"Take an umbrella."},{"id":"2sbqz0b","type":"paragraph","text":"Boolean values are used in logical operations (and, or, not) to combine or invert conditions."},{"id":"3j5rxz1","type":"paragraph","text":"True"},{"id":"fkkdo9c","type":"paragraph","text":"Many built in python functions return Boolean values, like bool(), isalpha(), isdigit() and others."},{"id":"krt2gwk","type":"paragraph","text":"FalseTrue"},{"id":"irb2t6g","type":"borderedtext","title":"In Excel","text":"Booleans are used in data validation rules to enforce conditions on cell values, such as ensuring a value is within a certain range:\r\n                = AND(A1 >= 1, A1 <= 100)\r\n                \r\n                You can apply Boolean logic to create dynamic formatting rules. For example, format cells if they meet a specific Boolean condition:\r\n                =A1 > 100\r\n                \r\n                Boolean logic can also be used to identify errors or inconsistencies in data, for example, checking if a set of values meets specific criteria:\r\n                =IFERROR(A1/B1, FALSE)"},{"id":"zuk1mhy","type":"subheading","text":"1.5.2 Numeric Data Type"},{"id":"yoamku3","type":"paragraph","text":"Numeric data types consist of numbers which can be computed mathematically with various standard operators such as addition, subtraction, multiplication, division, and more."},{"id":"vqx3f4l","type":"paragraph","text":"It can be an integer, floating-point number, or even a complex number. Common examples include exam marks, height, weight, fees, and other measurements."},{"id":"ivwcjgd","type":"subheading","text":"1.5.2.1 Integer"},{"id":"3bgep6j","type":"paragraph","text":"An integer data type is used to represent whole numbers without any fractional or decimal parts. Integers can be positive, negative, or zero, and they do not include any digits after a decimal point."},{"id":"fn0eyvy","type":"borderedtext","title":"Excel Context","text":"In Excel, any whole number entered into a cell is automatically treated as an integer."},{"id":"l1338lw","type":"table","headers":["D","E","F","G"],"rows":[["","50","100",""],["","2","",""]]},{"id":"cmnvisa","type":"paragraph","text":"In python, integers are represented by the ''int'' data type."},{"id":"fofyzo5","type":"paragraph","text":"Type of a: &nbsp;<class ''int''>"},{"id":"olxt4ep","type":"subheading","text":"1.5.2.2 Float"},{"id":"cqrp47x","type":"paragraph","text":"The float data type (short for \"floating-point\") is a data type used to represent numbers that have a fractional part, typically with a decimal point. Floating-point numbers are used to represent real numbers that require more precision than integers can provide, especially when dealing with very large or very small numbers."},{"id":"yb3eea4","type":"borderedtext","title":"Excel Context","text":"In Excel, numbers with decimal points are treated as floats."},{"id":"tgtx1ut","type":"table","headers":["D","E","F","G"],"rows":[["","7.89","18.7782",""],["","2.38","",""]]},{"id":"ac6bi51","type":"paragraph","text":"In Python, floats are represented by the ''float'' data type."},{"id":"69y2evl","type":"paragraph","text":"Type of pi_value: &nbsp;<class ''float''>"},{"id":"6hc3qdv","type":"subheading","text":"1.5.2.3 Complex"},{"id":"jr1uh44","type":"paragraph","text":"The complex data type is used to represent complex numbers, which are numbers that have both a real part and an imaginary part."},{"id":"7fnkr8h","type":"paragraph","text":"A complex number is expressed as a + bi where:"},{"id":"fqhb7jd","type":"list","title":"","points":["a is the real part","bi is the imaginary part","i is the imaginary unit with the property i&sup2; = -1"]},{"id":"o30fq2g","type":"borderedtext","title":"Excel Context","text":"Excel has a built-in function to handle complex numbers, allowing you to perform arithmetic operations and other calculations with them."},{"id":"2zpj7ej","type":"table","headers":["D","E","F"],"rows":[["real","imaginary","complex"],["3","4","3+4i"]]},{"id":"74qgzjg","type":"paragraph","text":"Python has native support for complex numbers with the ''complex'' data type."},{"id":"ppou0ql","type":"paragraph","text":"Type of c: &nbsp;<class ''complex''>"},{"id":"i1cvsdc","type":"subheading","text":"1.5.3 String"},{"id":"8i0rxfv","type":"paragraph","text":"The string data type is used to represent sequences of characters, such as letters, numbers, symbols, and spaces. It is a versatile and essential type for handling and manipulating text in computing."},{"id":"c13qgnl","type":"borderedtext","title":"Excel Context","text":"In Excel, you can enter text directly into a cell, and it is treated as a string."},{"id":"vvledoq","type":"table","headers":["D","E","F"],"rows":[["str1 ▼","str2 ▼","string ▼"],["Hello","world","Hello world"]]},{"id":"fms7t0d","type":"paragraph","text":"In python, strings can be defined using single quotes, double quotes or triple quotes."},{"id":"jia7cpw","type":"paragraph","text":"String with the use of Single Quotes:Welcome to the Geeks World<class ''str''>"},{"id":"q7k23kn","type":"heading","text":"Practice Check: Data Types"},{"id":"n9j85wv","type":"paragraph","text":"Test your understanding of the different data types covered in this section before moving on to the final assessment."},{"id":"sx5n942","type":"assessment","title":"Practice Check","questions":[{"text":"Which data type is most appropriate for a variable that tracks whether a customer is a premium subscriber or not?","options":["String","Float","Boolean","Integer"],"correct":"2"}]},{"id":"r4jhdar","type":"assessment","title":"Practice Check","questions":[{"text":"If you are recording the exact temperature in degrees Celsius (e.g., 23.5), which data type must you use to maintain accuracy?","options":["Integer","Float","Boolean","Complex"],"correct":"1"}]},{"id":"fa652r1","type":"assessment","title":"Practice Check","questions":[{"text":"Which of the following is the best example of a String data type?","options":["3.14159","\"Hello World\"","True","42"],"correct":"1"}]},{"id":"w4kr21x","type":"assessment","title":"Practice Check","questions":[{"text":"In the complex number expression a + bi, what does the i represent?","options":["An integer variable","The real part","The imaginary unit","A floating-point number"],"correct":"2"}]},{"id":"sdbcjbd","type":"assessment","title":"Practice Check","questions":[{"text":"In Excel, if you enter a whole number into a cell, what data type is it automatically treated as?","options":["Float","String","Integer","Boolean"],"correct":"2"}]},{"id":"a10jzmo","type":"heading","text":"1.6 Basic Structures used in data analytics"},{"id":"2bqoqb6","type":"subheading","text":"1.6.1 Tables"},{"id":"9y6jz7r","type":"paragraph","text":"Tables are used to structured data, it is essentially a two-dimensional structure with rows and columns."},{"id":"czj9m82","type":"paragraph","text":"Rows, also known as records or observations, are the horizontal elements in a table."},{"id":"b56nafp","type":"paragraph","text":"Columns, also known as fields or variables, are the vertical elements in a table. Each column represents a specific attribute or piece of information related to the data set."},{"id":"o1tlxw0","type":"table","headers":["Name ▼","Age ▼","Degree ▼","Year of Joining ▼","experience ▼","Department ▼","Salary ▼"],"rows":[["ARJUN R","28","BA","2006","8","Marketing","18000"],["SUNIL CHERUVATHOOR SUNNY","42","B.com","2015","22","Finance","52000"],["ARJUN SANKAR","51","Bsc","2006","31","Marketing","91000"],["RINOY LAL","50","B.com M.com","2008","30","Finance","50000"],["ANGEL JOSE","34","B.com","2008","14","Marketing","24000"]]},{"id":"9im3jex","type":"subheading","text":"1.6.2 Lists"},{"id":"un5w5ws","type":"paragraph","text":"While tables are used for structured data, lists are used for storing unstructured or semi-structured data. A list is a collection of items, where each item can be of a different data type or structure. Lists are often used for tasks like storing unstructured text data, logs, or simple collection of values."},{"id":"8ktyyk3","type":"borderedtext","title":"Key Property","text":"A List is enclosed with [] and is an  collection of elements that can be  (add, delete, and modify)."},{"id":"7vo8fbo","type":"paragraph","text":"Lists can also contain mixed data types within the same collection:"},{"id":"cll5ozw","type":"subheading","text":"1.6.3 Tuple"},{"id":"vjcloal","type":"paragraph","text":"A tuple is like a list, but it is locked. Once created, you cannot change it. It is faster and safer for data that should stay constant."},{"id":"sz2zlim","type":"borderedtext","title":"Key Property","text":"Tuple is enclosed with () and is an  collection of elements that  (add, delete, and modify)."},{"id":"oi97bgc","type":"list","title":"","points":["Best for: Fixed data like GPS coordinates (Latitude, Longitude) or RGB color codes."]},{"id":"t68pi6v","type":"subheading","text":"1.6.4 Set"},{"id":"fcmqt1x","type":"paragraph","text":"A set is like a bag of unique items. It automatically removes any duplicates you try to add and does not care about order."},{"id":"5ok4x1y","type":"borderedtext","title":"Key Property","text":"Set is enclosed with {} and is an  collection of  elements."},{"id":"qk7l45k","type":"list","title":"","points":["Best for: Membership testing (checking if an item exists) and removing duplicates from a list."]},{"id":"s9wkdfn","type":"subheading","text":"1.6.5 Dictionary"},{"id":"0xya4a9","type":"paragraph","text":"A dictionary works like a real-life dictionary or a phonebook. You store data in pairs: a unique Key and its associated Value."},{"id":"6xmc2r1","type":"borderedtext","title":"Key Property","text":"Dictionary is enclosed with {} and elements are represented as  pairs."},{"id":"yfovfz8","type":"list","title":"","points":["Best for: When you need to retrieve data quickly using a label instead of a number."]},{"id":"4utrxhp","type":"heading","text":"Practice Check: Basic Structures"},{"id":"udgvr7k","type":"paragraph","text":"Test your understanding of Tables, Lists, Tuples, Sets, and Dictionaries."},{"id":"ue6rn2u","type":"assessment","title":"Practice Check","questions":[{"text":"Which data structure is \"locked\" or immutable, meaning its elements cannot be changed after creation?","options":["List","Tuple","Dictionary","Set"],"correct":"1"}]},{"id":"eewbdbh","type":"assessment","title":"Practice Check","questions":[{"text":"Which data structure automatically removes any duplicate items you try to add?","options":["List","Tuple","Set","Table"],"correct":"2"}]},{"id":"lbl6mzg","type":"assessment","title":"Practice Check","questions":[{"text":"How are elements typically represented in a Dictionary?","options":["index: value","key: value","row: column","value only"],"correct":"1"}]},{"id":"b32p36p","type":"assessment","title":"Practice Check","questions":[{"text":"Which brackets are used to define a List in Python?","options":["Parentheses ( )","Curly Braces { }","Square Brackets [ ]","Angle Brackets < >"],"correct":"2"}]},{"id":"4c8tqs5","type":"assessment","title":"Practice Check","questions":[{"text":"Which brackets are used to define both Sets and Dictionaries?","options":["Square Brackets [ ]","Curly Braces { }","Parentheses ( )","Double Quotes \" \""],"correct":"1"}]},{"id":"8bwnv7c","type":"heading","text":"1.7 Statistics"},{"id":"wds50bn","type":"subheading","text":"1.7.1 Descriptive Statistics"},{"id":"kzo81m8","type":"paragraph","text":"Descriptive statistics are used to describe, show, or summarize data in a meaningful way such that, for example, patterns might emerge from the data. It focuses on the characteristics of the data set you are currently looking at."},{"id":"90z09es","type":"borderedtext","title":"Examples","text":"Calculating the average (mean) score of a class, the range of salaries in a company, or creating a chart showing sales trends."},{"id":"fmqpbka","type":"subheading","text":"1.7.2 Inferential Statistics"},{"id":"mgup9en","type":"paragraph","text":"Inferential statistics allows you to make predictions or \"inferences\" from that data. With inferential statistics, you take data from samples and make generalizations about a larger population."},{"id":"xioo2it","type":"heading","text":"1.8 Types of Data"},{"id":"rlzqaen","type":"subheading","text":"1.8.1 Qualitative Data"},{"id":"bthhud2","type":"paragraph","text":"Also known as categorical data, qualitative data describes characteristics that fit into specific categories rather than numerical values."},{"id":"xkmzstq","type":"paragraph","text":"Examples: Eye Color, Country Name, Phone Type, Car Brand etc."},{"id":"vipiir4","type":"paragraph","text":"Examples: Ranking of users in a competition, Rating of a product taken by the company on a scale of 1-10, Economic status: low, medium, and high."},{"id":"62z3ffn","type":"subheading","text":"1.8.2 Quantitative Data"},{"id":"ubi1atm","type":"paragraph","text":"Also known as numerical data, quantitative data represents numerical values that answer questions like \"how much,\" \"how often,\" or \"how many.\""},{"id":"xpry0xv","type":"heading","text":"1.9 Structured and Unstructured Data"},{"id":"cg889ia","type":"list","title":"","points":["Fits into rows and columns","Includes discrete data types (numbers, dates, short text)","Easier to analyze and interpret","Often stored in databases or spreadsheets","Examples: Names, phone numbers, banking information"]},{"id":"s3z0im8","type":"list","title":"","points":["Has no fixed schema","Complex formats like audio files and web pages","More difficult to analyze","Often stored in data lakes or file systems","Examples: Emails, social media posts, images"]},{"id":"bl5jq55","type":"subheading","text":"Structured Data"},{"id":"zm8t6bb","type":"subheading","text":"Unstructured Data"},{"id":"rdjuw72","type":"heading","text":"1.10 Raw Data, Meta Data and Big Data"},{"id":"08kiz4w","type":"subheading","text":"1.10.1 Raw Data"},{"id":"nyx4u5j","type":"paragraph","text":"Raw Data (also known as \"primary data\" or \"atomic data\") is data in its most basic form, exactly as it was collected before any cleaning, filtering, or analysis has occurred."},{"id":"v0s3bmb","type":"callout","title":"Unprocessed","points":["Unprocessed: No calculations (like averages or totals) have been performed.","Full of \"Noise\": It often contains errors, duplicates, missing values, or irrelevant symbols.","High Volume: Because nothing has been filtered out, raw data takes up the most storage space.","Objective: It is a direct record of an event (e.g., a sensor reading) without any human interpretation."]},{"id":"j2etc3a","type":"subheading","text":"1.10.2 Meta Data"},{"id":"z3j0nu8","type":"paragraph","text":"Metadata is essentially \"data about data.\" It provides information about other data, making it easier to understand, organize, and use that data. Metadata can describe the structure, context, and characteristics of the data."},{"id":"kdlvpzq","type":"subheading","text":"1.10.3 Big Data"},{"id":"yroscom","type":"heading","text":"Practice Check: Data Categories"},{"id":"ixl09kx","type":"assessment","title":"Practice Check","questions":[{"text":"Which of the following is considered \"Unstructured Data\"?","options":["A SQL database table with rows and columns","A social media post containing text and an image","An Excel spreadsheet of monthly expenses","A bank statement in CSV format"],"correct":"1"}]},{"id":"ap9vtc0","type":"assessment","title":"Practice Check","questions":[{"text":"Metadata is best defined as:","options":["Data that has been deleted from a system","\"Data about data\" that describes its characteristics","Encrypted data used for security purposes","Large datasets that require supercomputers to process"],"correct":"1"}]},{"id":"a57sqzf","type":"assessment","title":"Practice Check","questions":[{"text":"What is a primary characteristic of \"Raw Data\"?","options":["It is already cleaned and ready for final analysis","It takes up very little storage space","It is unprocessed and full of \"noise\" (errors or duplicates)","It has been interpreted by humans to remove bias"],"correct":"2"}]},{"id":"svbproh","type":"paragraph","text":"Test your knowledge of data types, structures, metadata, and the basic principles of big data."}]} -->
<h2 class="text-2xl font-extrabold text-white mt-12 mb-6 border-b border-white/10 pb-2">1.1 Data, Information and Knowledge</h2>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Data</h3>
<p class="text-slate-300 leading-relaxed mb-6">Data refers to raw facts, figures, or observations collected for analysis or reference. On its own, data is often meaningless because it lacks context.</p>
<div class="my-6 border-l-4 border-brand bg-brand/5 p-6 rounded-r-2xl text-left">
  <h4 class="text-white font-bold text-sm mb-3">Examples of Data</h4>
  <ul class="space-y-3" style="list-style-type: none; padding-left: 0;">
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>The number 42.</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>A list of dates: 12/05, 14/05, 19/05.</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>The word "Cochin."</span>
    </li>
  </ul>
</div>
<p class="text-slate-300 leading-relaxed mb-6">Data can appear in many forms such as:</p>
<div class="my-6 text-left space-y-4">
  
  <ul class="space-y-3" style="list-style-type: none; padding-left: 0;">
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Numbers</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Text</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Images</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Audio</span>
    </li>
  </ul>
</div>
<h2 class="text-2xl font-extrabold text-white mt-12 mb-6 border-b border-white/10 pb-2">1.2 Information: The Finished Product</h2>
<p class="text-slate-300 leading-relaxed mb-6">Information is data that has been processed, structured, or presented within a specific context to make it meaningful and useful. It is "data with a story."</p>
<div class="my-6 border-l-4 border-white bg-white/5 p-6 rounded-r-2xl text-left">
  <h4 class="text-white font-bold text-sm mb-3">Characteristics</h4>
  <p class="text-slate-350 text-sm leading-relaxed mb-0">Processed, organized, and relevant to a goal.</p>
</div>
<div class="my-6 border-l-4 border-brand bg-brand/5 p-6 rounded-r-2xl text-left">
  <h4 class="text-white font-bold text-sm mb-3">Examples of Information</h4>
  <ul class="space-y-3" style="list-style-type: none; padding-left: 0;">
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>"42" is the number of students who passed the AI exam.</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>The dates represent a schedule for upcoming Python training sessions.</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>"Cochin" is the current location for a regional education tour.</span>
    </li>
  </ul>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Key Differences at a Glance</h3>
<div class="my-8 overflow-x-auto rounded-2xl border border-white/10 shadow-soft bg-[#0B2A22]/40">
  <table class="w-full text-sm text-left">
    <thead class="bg-white/5 border-b border-white/10">
      <tr>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Feature</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Data</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Information</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/5">
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Form</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Raw, unorganized facts.</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Organized and processed facts.</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Level</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Low-level (the starting point).</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">High-level (the output).</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Dependence</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Independent of context.</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Dependent on context.</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Meaning</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Meaningless on its own.</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Meaningful and actionable.</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Example</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Individual test scores.</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">The average grade of a class.</td>
    </tr>
    </tbody>
  </table>
</div>
<h2 class="text-2xl font-extrabold text-white mt-12 mb-6 border-b border-white/10 pb-2">1.3 Knowledge: The Application of Information</h2>
<p class="text-slate-300 leading-relaxed mb-6">While information is data with context, knowledge is the next step in the hierarchy. It is the ability to use information to make decisions, solve problems, or predict future outcomes. Knowledge is gained through experience, study, and reflection.</p>
<div class="my-6 border-l-4 border-white bg-white/5 p-6 rounded-r-2xl text-left">
  <h4 class="text-white font-bold text-sm mb-3">Characteristics</h4>
  <p class="text-slate-350 text-sm leading-relaxed mb-0">Action-oriented, subjective, and cumulative.
                
                If information tells you what is happening, knowledge tells you how to use that information or why it matters.</p>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Example Scenario: Educational Planning</h3>
<p class="text-slate-300 leading-relaxed mb-6">To see how these concepts build on one another, let''s look at a practical scenario involving educational planning:</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">DATA The Raw Input</h3>
<p class="text-slate-300 leading-relaxed mb-6">A list of numbers. On their own, these are just digits without a purpose or context.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">INFORMATION The Processed Output</h3>
<p class="text-slate-300 leading-relaxed mb-6">Python Mock Test Scores</p>
<p class="text-slate-300 leading-relaxed mb-6">Context applied. By adding meaning, we now know these are test results and can spot trends.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">KNOWLEDGE Insight & Action</h3>
<p class="text-slate-300 leading-relaxed mb-6">Root Cause: Struggling students missed the "Loops" session.</p>
<p class="text-slate-300 leading-relaxed mb-6">Using the information to identify a learning gap and taking strategic action before the final exam.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Summary Comparison</h3>
<div class="my-8 overflow-x-auto rounded-2xl border border-white/10 shadow-soft bg-[#0B2A22]/40">
  <table class="w-full text-sm text-left">
    <thead class="bg-white/5 border-b border-white/10">
      <tr>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Concept</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Simple Definition</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Example</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/5">
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Data</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Symbols/Facts</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">"32"</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Information</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Contextualized Data</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">"32°C is the current temperature."</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Knowledge</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Applied Information</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">"At 32°C, I should wear light clothing to stay comfortable."</td>
    </tr>
    </tbody>
  </table>
</div>
<h2 class="text-2xl font-extrabold text-white mt-12 mb-6 border-b border-white/10 pb-2">Practice Check</h2>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-tiuflcq" data-questions="[{&quot;text&quot;:&quot;Which of the following scenarios best illustrates the difference between data and information?&quot;,&quot;options&quot;:[&quot;A list of temperatures is information, while a chart showing them is data.&quot;,&quot;Random numbers are data, while knowing these represent daily sales is information.&quot;,&quot;A printed textbook is data, while a digital ebook is information.&quot;,&quot;Data is always numbers, while information is always words.&quot;],&quot;correct&quot;:&quot;1&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. Which of the following scenarios best illustrates the difference between data and information?</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>A list of temperatures is information, while a chart showing them is data.</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="1" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''1'');
          ">
            <span>Random numbers are data, while knowing these represent daily sales is information.</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="2" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''2'');
          ">
            <span>A printed textbook is data, while a digital ebook is information.</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="3" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''3'');
          ">
            <span>Data is always numbers, while information is always words.</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-tiuflcq'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-16q38ip" data-questions="[{&quot;text&quot;:&quot;Which level of the hierarchy is characterized by being ''action-oriented'' and built through experience and reflection?&quot;,&quot;options&quot;:[&quot;Metadata&quot;,&quot;Information&quot;,&quot;Knowledge&quot;,&quot;Data&quot;],&quot;correct&quot;:&quot;2&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. Which level of the hierarchy is characterized by being &#39;action-oriented&#39; and built through experience and reflection?</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>Metadata</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="1" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''1'');
          ">
            <span>Information</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="2" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''2'');
          ">
            <span>Knowledge</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="3" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''3'');
          ">
            <span>Data</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-16q38ip'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-mtz1zyw" data-questions="[{&quot;text&quot;:&quot;Raw data is often meaningless on its own because it lacks context and organization.&quot;,&quot;options&quot;:[&quot;True&quot;,&quot;False&quot;],&quot;correct&quot;:&quot;0&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check (True/False)
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. Raw data is often meaningless on its own because it lacks context and organization.</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>True</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="1" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''1'');
          ">
            <span>False</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-mtz1zyw'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-92n2fyo" data-questions="[{&quot;text&quot;:&quot;Information is the highest level of the hierarchy and represents the final stage of understanding.&quot;,&quot;options&quot;:[&quot;True&quot;,&quot;False&quot;],&quot;correct&quot;:&quot;1&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check (True/False)
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. Information is the highest level of the hierarchy and represents the final stage of understanding.</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>True</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="1" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''1'');
          ">
            <span>False</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-92n2fyo'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-l8g5b3f" data-questions="[{&quot;text&quot;:&quot;Summarizing a large spreadsheet of sales figures into a monthly growth chart is an example of creating knowledge.&quot;,&quot;options&quot;:[&quot;True&quot;,&quot;False&quot;],&quot;correct&quot;:&quot;1&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check (True/False)
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. Summarizing a large spreadsheet of sales figures into a monthly growth chart is an example of creating knowledge.</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>True</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="1" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''1'');
          ">
            <span>False</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-l8g5b3f'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<h2 class="text-2xl font-extrabold text-white mt-12 mb-6 border-b border-white/10 pb-2">1.4 Data Analysis</h2>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Concept</h3>
<p class="text-slate-300 leading-relaxed mb-6">Data Analysis is the process of converting raw data into useful information for decision making. Organizations use data analysis to:</p>
<div class="my-6 text-left space-y-4">
  
  <ul class="space-y-3" style="list-style-type: none; padding-left: 0;">
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Understand trends</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Identify patterns</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Support decisions</span>
    </li>
  </ul>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Insight:</h3>
<p class="text-slate-300 leading-relaxed mb-6">Data analysis answers questions like: What happened? Why did it happen? What might happen next?</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Example</h3>
<p class="text-slate-300 leading-relaxed mb-6">Imagine a business tracking its monthly revenue. The raw numbers (Data) show a decline. By processing this (Information), the owner sees the decline is specific to one product line. This insight allows them to investigate the cause and make an informed decision (Data Analysis) to improve future performance.</p>
<h2 class="text-2xl font-extrabold text-white mt-12 mb-6 border-b border-white/10 pb-2">1.5 Data Variable Types</h2>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">1.5.1 Boolean Data Type</h3>
<p class="text-slate-300 leading-relaxed mb-6">The Boolean Data type is used to store only two possible values: True and False. In binary systems, these are represented by 1 (True) and 0 (False).</p>
<div class="my-6 border-l-4 border-white bg-white/5 p-6 rounded-r-2xl text-left">
  <h4 class="text-white font-bold text-sm mb-3">Core Concept</h4>
  <p class="text-slate-350 text-sm leading-relaxed mb-0">Booleans represent a logical state. They cannot be added or subtracted like numbers because they only have two possible states: true or false.</p>
</div>
<p class="text-slate-300 leading-relaxed mb-6">Booleans are essential for comparisons, conditional statements, and logical operations that direct the flow of a program. Interestingly, Booleans are very efficient, usually requiring only one byte of memory compared to text variables which require much more.</p>
<div class="my-6 border-l-4 border-white bg-white/5 p-6 rounded-r-2xl text-left">
  <h4 class="text-white font-bold text-sm mb-3">In Python</h4>
  <p class="text-slate-350 text-sm leading-relaxed mb-0">Python represents these as True and False (note the capitalization). They are the foundation of if, elif, and else statements used to control program logic.</p>
</div>
<p class="text-slate-300 leading-relaxed mb-6">Take an umbrella.</p>
<p class="text-slate-300 leading-relaxed mb-6">Boolean values are used in logical operations (and, or, not) to combine or invert conditions.</p>
<p class="text-slate-300 leading-relaxed mb-6">True</p>
<p class="text-slate-300 leading-relaxed mb-6">Many built in python functions return Boolean values, like bool(), isalpha(), isdigit() and others.</p>
<p class="text-slate-300 leading-relaxed mb-6">FalseTrue</p>
<div class="my-6 border-l-4 border-white bg-white/5 p-6 rounded-r-2xl text-left">
  <h4 class="text-white font-bold text-sm mb-3">In Excel</h4>
  <p class="text-slate-350 text-sm leading-relaxed mb-0">Booleans are used in data validation rules to enforce conditions on cell values, such as ensuring a value is within a certain range:
                = AND(A1 >= 1, A1 <= 100)
                
                You can apply Boolean logic to create dynamic formatting rules. For example, format cells if they meet a specific Boolean condition:
                =A1 > 100
                
                Boolean logic can also be used to identify errors or inconsistencies in data, for example, checking if a set of values meets specific criteria:
                =IFERROR(A1/B1, FALSE)</p>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">1.5.2 Numeric Data Type</h3>
<p class="text-slate-300 leading-relaxed mb-6">Numeric data types consist of numbers which can be computed mathematically with various standard operators such as addition, subtraction, multiplication, division, and more.</p>
<p class="text-slate-300 leading-relaxed mb-6">It can be an integer, floating-point number, or even a complex number. Common examples include exam marks, height, weight, fees, and other measurements.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">1.5.2.1 Integer</h3>
<p class="text-slate-300 leading-relaxed mb-6">An integer data type is used to represent whole numbers without any fractional or decimal parts. Integers can be positive, negative, or zero, and they do not include any digits after a decimal point.</p>
<div class="my-6 border-l-4 border-white bg-white/5 p-6 rounded-r-2xl text-left">
  <h4 class="text-white font-bold text-sm mb-3">Excel Context</h4>
  <p class="text-slate-350 text-sm leading-relaxed mb-0">In Excel, any whole number entered into a cell is automatically treated as an integer.</p>
</div>
<div class="my-8 overflow-x-auto rounded-2xl border border-white/10 shadow-soft bg-[#0B2A22]/40">
  <table class="w-full text-sm text-left">
    <thead class="bg-white/5 border-b border-white/10">
      <tr>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">D</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">E</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">F</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">G</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/5">
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0"></td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">50</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">100</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0"></td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0"></td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">2</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0"></td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0"></td>
    </tr>
    </tbody>
  </table>
</div>
<p class="text-slate-300 leading-relaxed mb-6">In python, integers are represented by the ''int'' data type.</p>
<p class="text-slate-300 leading-relaxed mb-6">Type of a: &nbsp;<class ''int''></p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">1.5.2.2 Float</h3>
<p class="text-slate-300 leading-relaxed mb-6">The float data type (short for "floating-point") is a data type used to represent numbers that have a fractional part, typically with a decimal point. Floating-point numbers are used to represent real numbers that require more precision than integers can provide, especially when dealing with very large or very small numbers.</p>
<div class="my-6 border-l-4 border-white bg-white/5 p-6 rounded-r-2xl text-left">
  <h4 class="text-white font-bold text-sm mb-3">Excel Context</h4>
  <p class="text-slate-350 text-sm leading-relaxed mb-0">In Excel, numbers with decimal points are treated as floats.</p>
</div>
<div class="my-8 overflow-x-auto rounded-2xl border border-white/10 shadow-soft bg-[#0B2A22]/40">
  <table class="w-full text-sm text-left">
    <thead class="bg-white/5 border-b border-white/10">
      <tr>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">D</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">E</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">F</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">G</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/5">
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0"></td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">7.89</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">18.7782</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0"></td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0"></td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">2.38</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0"></td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0"></td>
    </tr>
    </tbody>
  </table>
</div>
<p class="text-slate-300 leading-relaxed mb-6">In Python, floats are represented by the ''float'' data type.</p>
<p class="text-slate-300 leading-relaxed mb-6">Type of pi_value: &nbsp;<class ''float''></p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">1.5.2.3 Complex</h3>
<p class="text-slate-300 leading-relaxed mb-6">The complex data type is used to represent complex numbers, which are numbers that have both a real part and an imaginary part.</p>
<p class="text-slate-300 leading-relaxed mb-6">A complex number is expressed as a + bi where:</p>
<div class="my-6 text-left space-y-4">
  
  <ul class="space-y-3" style="list-style-type: none; padding-left: 0;">
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>a is the real part</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>bi is the imaginary part</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>i is the imaginary unit with the property i&sup2; = -1</span>
    </li>
  </ul>
</div>
<div class="my-6 border-l-4 border-white bg-white/5 p-6 rounded-r-2xl text-left">
  <h4 class="text-white font-bold text-sm mb-3">Excel Context</h4>
  <p class="text-slate-350 text-sm leading-relaxed mb-0">Excel has a built-in function to handle complex numbers, allowing you to perform arithmetic operations and other calculations with them.</p>
</div>
<div class="my-8 overflow-x-auto rounded-2xl border border-white/10 shadow-soft bg-[#0B2A22]/40">
  <table class="w-full text-sm text-left">
    <thead class="bg-white/5 border-b border-white/10">
      <tr>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">D</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">E</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">F</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/5">
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">real</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">imaginary</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">complex</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">3</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">4</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">3+4i</td>
    </tr>
    </tbody>
  </table>
</div>
<p class="text-slate-300 leading-relaxed mb-6">Python has native support for complex numbers with the ''complex'' data type.</p>
<p class="text-slate-300 leading-relaxed mb-6">Type of c: &nbsp;<class ''complex''></p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">1.5.3 String</h3>
<p class="text-slate-300 leading-relaxed mb-6">The string data type is used to represent sequences of characters, such as letters, numbers, symbols, and spaces. It is a versatile and essential type for handling and manipulating text in computing.</p>
<div class="my-6 border-l-4 border-white bg-white/5 p-6 rounded-r-2xl text-left">
  <h4 class="text-white font-bold text-sm mb-3">Excel Context</h4>
  <p class="text-slate-350 text-sm leading-relaxed mb-0">In Excel, you can enter text directly into a cell, and it is treated as a string.</p>
</div>
<div class="my-8 overflow-x-auto rounded-2xl border border-white/10 shadow-soft bg-[#0B2A22]/40">
  <table class="w-full text-sm text-left">
    <thead class="bg-white/5 border-b border-white/10">
      <tr>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">D</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">E</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">F</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/5">
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">str1 ▼</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">str2 ▼</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">string ▼</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Hello</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">world</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Hello world</td>
    </tr>
    </tbody>
  </table>
</div>
<p class="text-slate-300 leading-relaxed mb-6">In python, strings can be defined using single quotes, double quotes or triple quotes.</p>
<p class="text-slate-300 leading-relaxed mb-6">String with the use of Single Quotes:Welcome to the Geeks World<class ''str''></p>
<h2 class="text-2xl font-extrabold text-white mt-12 mb-6 border-b border-white/10 pb-2">Practice Check: Data Types</h2>
<p class="text-slate-300 leading-relaxed mb-6">Test your understanding of the different data types covered in this section before moving on to the final assessment.</p>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-vft278n" data-questions="[{&quot;text&quot;:&quot;Which data type is most appropriate for a variable that tracks whether a customer is a premium subscriber or not?&quot;,&quot;options&quot;:[&quot;String&quot;,&quot;Float&quot;,&quot;Boolean&quot;,&quot;Integer&quot;],&quot;correct&quot;:&quot;2&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. Which data type is most appropriate for a variable that tracks whether a customer is a premium subscriber or not?</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>String</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="1" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''1'');
          ">
            <span>Float</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="2" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''2'');
          ">
            <span>Boolean</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="3" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''3'');
          ">
            <span>Integer</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-vft278n'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-96w52zn" data-questions="[{&quot;text&quot;:&quot;If you are recording the exact temperature in degrees Celsius (e.g., 23.5), which data type must you use to maintain accuracy?&quot;,&quot;options&quot;:[&quot;Integer&quot;,&quot;Float&quot;,&quot;Boolean&quot;,&quot;Complex&quot;],&quot;correct&quot;:&quot;1&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. If you are recording the exact temperature in degrees Celsius (e.g., 23.5), which data type must you use to maintain accuracy?</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>Integer</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="1" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''1'');
          ">
            <span>Float</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="2" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''2'');
          ">
            <span>Boolean</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="3" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''3'');
          ">
            <span>Complex</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-96w52zn'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-alxmnfn" data-questions="[{&quot;text&quot;:&quot;Which of the following is the best example of a String data type?&quot;,&quot;options&quot;:[&quot;3.14159&quot;,&quot;\&quot;Hello World\&quot;&quot;,&quot;True&quot;,&quot;42&quot;],&quot;correct&quot;:&quot;1&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. Which of the following is the best example of a String data type?</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>3.14159</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="1" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''1'');
          ">
            <span>&quot;Hello World&quot;</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="2" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''2'');
          ">
            <span>True</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="3" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''3'');
          ">
            <span>42</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-alxmnfn'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-d1ikz0p" data-questions="[{&quot;text&quot;:&quot;In the complex number expression a + bi, what does the i represent?&quot;,&quot;options&quot;:[&quot;An integer variable&quot;,&quot;The real part&quot;,&quot;The imaginary unit&quot;,&quot;A floating-point number&quot;],&quot;correct&quot;:&quot;2&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. In the complex number expression a + bi, what does the i represent?</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>An integer variable</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="1" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''1'');
          ">
            <span>The real part</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="2" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''2'');
          ">
            <span>The imaginary unit</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="3" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''3'');
          ">
            <span>A floating-point number</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-d1ikz0p'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-xzqn5lr" data-questions="[{&quot;text&quot;:&quot;In Excel, if you enter a whole number into a cell, what data type is it automatically treated as?&quot;,&quot;options&quot;:[&quot;Float&quot;,&quot;String&quot;,&quot;Integer&quot;,&quot;Boolean&quot;],&quot;correct&quot;:&quot;2&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. In Excel, if you enter a whole number into a cell, what data type is it automatically treated as?</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>Float</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="1" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''1'');
          ">
            <span>String</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="2" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''2'');
          ">
            <span>Integer</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="3" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''3'');
          ">
            <span>Boolean</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-xzqn5lr'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<h2 class="text-2xl font-extrabold text-white mt-12 mb-6 border-b border-white/10 pb-2">1.6 Basic Structures used in data analytics</h2>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">1.6.1 Tables</h3>
<p class="text-slate-300 leading-relaxed mb-6">Tables are used to structured data, it is essentially a two-dimensional structure with rows and columns.</p>
<p class="text-slate-300 leading-relaxed mb-6">Rows, also known as records or observations, are the horizontal elements in a table.</p>
<p class="text-slate-300 leading-relaxed mb-6">Columns, also known as fields or variables, are the vertical elements in a table. Each column represents a specific attribute or piece of information related to the data set.</p>
<div class="my-8 overflow-x-auto rounded-2xl border border-white/10 shadow-soft bg-[#0B2A22]/40">
  <table class="w-full text-sm text-left">
    <thead class="bg-white/5 border-b border-white/10">
      <tr>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Name ▼</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Age ▼</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Degree ▼</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Year of Joining ▼</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">experience ▼</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Department ▼</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Salary ▼</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/5">
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">ARJUN R</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">28</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">BA</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">2006</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">8</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Marketing</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">18000</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">SUNIL CHERUVATHOOR SUNNY</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">42</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">B.com</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">2015</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">22</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Finance</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">52000</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">ARJUN SANKAR</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">51</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Bsc</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">2006</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">31</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Marketing</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">91000</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">RINOY LAL</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">50</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">B.com M.com</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">2008</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">30</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Finance</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">50000</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">ANGEL JOSE</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">34</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">B.com</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">2008</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">14</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Marketing</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">24000</td>
    </tr>
    </tbody>
  </table>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">1.6.2 Lists</h3>
<p class="text-slate-300 leading-relaxed mb-6">While tables are used for structured data, lists are used for storing unstructured or semi-structured data. A list is a collection of items, where each item can be of a different data type or structure. Lists are often used for tasks like storing unstructured text data, logs, or simple collection of values.</p>
<div class="my-6 border-l-4 border-white bg-white/5 p-6 rounded-r-2xl text-left">
  <h4 class="text-white font-bold text-sm mb-3">Key Property</h4>
  <p class="text-slate-350 text-sm leading-relaxed mb-0">A List is enclosed with [] and is an  collection of elements that can be  (add, delete, and modify).</p>
</div>
<p class="text-slate-300 leading-relaxed mb-6">Lists can also contain mixed data types within the same collection:</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">1.6.3 Tuple</h3>
<p class="text-slate-300 leading-relaxed mb-6">A tuple is like a list, but it is locked. Once created, you cannot change it. It is faster and safer for data that should stay constant.</p>
<div class="my-6 border-l-4 border-white bg-white/5 p-6 rounded-r-2xl text-left">
  <h4 class="text-white font-bold text-sm mb-3">Key Property</h4>
  <p class="text-slate-350 text-sm leading-relaxed mb-0">Tuple is enclosed with () and is an  collection of elements that  (add, delete, and modify).</p>
</div>
<div class="my-6 text-left space-y-4">
  
  <ul class="space-y-3" style="list-style-type: none; padding-left: 0;">
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Best for: Fixed data like GPS coordinates (Latitude, Longitude) or RGB color codes.</span>
    </li>
  </ul>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">1.6.4 Set</h3>
<p class="text-slate-300 leading-relaxed mb-6">A set is like a bag of unique items. It automatically removes any duplicates you try to add and does not care about order.</p>
<div class="my-6 border-l-4 border-white bg-white/5 p-6 rounded-r-2xl text-left">
  <h4 class="text-white font-bold text-sm mb-3">Key Property</h4>
  <p class="text-slate-350 text-sm leading-relaxed mb-0">Set is enclosed with {} and is an  collection of  elements.</p>
</div>
<div class="my-6 text-left space-y-4">
  
  <ul class="space-y-3" style="list-style-type: none; padding-left: 0;">
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Best for: Membership testing (checking if an item exists) and removing duplicates from a list.</span>
    </li>
  </ul>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">1.6.5 Dictionary</h3>
<p class="text-slate-300 leading-relaxed mb-6">A dictionary works like a real-life dictionary or a phonebook. You store data in pairs: a unique Key and its associated Value.</p>
<div class="my-6 border-l-4 border-white bg-white/5 p-6 rounded-r-2xl text-left">
  <h4 class="text-white font-bold text-sm mb-3">Key Property</h4>
  <p class="text-slate-350 text-sm leading-relaxed mb-0">Dictionary is enclosed with {} and elements are represented as  pairs.</p>
</div>
<div class="my-6 text-left space-y-4">
  
  <ul class="space-y-3" style="list-style-type: none; padding-left: 0;">
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Best for: When you need to retrieve data quickly using a label instead of a number.</span>
    </li>
  </ul>
</div>
<h2 class="text-2xl font-extrabold text-white mt-12 mb-6 border-b border-white/10 pb-2">Practice Check: Basic Structures</h2>
<p class="text-slate-300 leading-relaxed mb-6">Test your understanding of Tables, Lists, Tuples, Sets, and Dictionaries.</p>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-dvw2gt1" data-questions="[{&quot;text&quot;:&quot;Which data structure is \&quot;locked\&quot; or immutable, meaning its elements cannot be changed after creation?&quot;,&quot;options&quot;:[&quot;List&quot;,&quot;Tuple&quot;,&quot;Dictionary&quot;,&quot;Set&quot;],&quot;correct&quot;:&quot;1&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. Which data structure is &quot;locked&quot; or immutable, meaning its elements cannot be changed after creation?</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>List</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="1" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''1'');
          ">
            <span>Tuple</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="2" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''2'');
          ">
            <span>Dictionary</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="3" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''3'');
          ">
            <span>Set</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-dvw2gt1'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-14tes8o" data-questions="[{&quot;text&quot;:&quot;Which data structure automatically removes any duplicate items you try to add?&quot;,&quot;options&quot;:[&quot;List&quot;,&quot;Tuple&quot;,&quot;Set&quot;,&quot;Table&quot;],&quot;correct&quot;:&quot;2&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. Which data structure automatically removes any duplicate items you try to add?</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>List</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="1" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''1'');
          ">
            <span>Tuple</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="2" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''2'');
          ">
            <span>Set</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="3" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''3'');
          ">
            <span>Table</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-14tes8o'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-7q8ns8f" data-questions="[{&quot;text&quot;:&quot;How are elements typically represented in a Dictionary?&quot;,&quot;options&quot;:[&quot;index: value&quot;,&quot;key: value&quot;,&quot;row: column&quot;,&quot;value only&quot;],&quot;correct&quot;:&quot;1&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. How are elements typically represented in a Dictionary?</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>index: value</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="1" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''1'');
          ">
            <span>key: value</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="2" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''2'');
          ">
            <span>row: column</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="3" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''3'');
          ">
            <span>value only</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-7q8ns8f'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-7gxmin6" data-questions="[{&quot;text&quot;:&quot;Which brackets are used to define a List in Python?&quot;,&quot;options&quot;:[&quot;Parentheses ( )&quot;,&quot;Curly Braces { }&quot;,&quot;Square Brackets [ ]&quot;,&quot;Angle Brackets < >&quot;],&quot;correct&quot;:&quot;2&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. Which brackets are used to define a List in Python?</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>Parentheses ( )</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="1" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''1'');
          ">
            <span>Curly Braces { }</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="2" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''2'');
          ">
            <span>Square Brackets [ ]</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="3" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''3'');
          ">
            <span>Angle Brackets &lt; &gt;</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-7gxmin6'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-b26cvwu" data-questions="[{&quot;text&quot;:&quot;Which brackets are used to define both Sets and Dictionaries?&quot;,&quot;options&quot;:[&quot;Square Brackets [ ]&quot;,&quot;Curly Braces { }&quot;,&quot;Parentheses ( )&quot;,&quot;Double Quotes \&quot; \&quot;&quot;],&quot;correct&quot;:&quot;1&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. Which brackets are used to define both Sets and Dictionaries?</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>Square Brackets [ ]</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="1" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''1'');
          ">
            <span>Curly Braces { }</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="2" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''2'');
          ">
            <span>Parentheses ( )</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="3" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''3'');
          ">
            <span>Double Quotes &quot; &quot;</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-b26cvwu'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<h2 class="text-2xl font-extrabold text-white mt-12 mb-6 border-b border-white/10 pb-2">1.7 Statistics</h2>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">1.7.1 Descriptive Statistics</h3>
<p class="text-slate-300 leading-relaxed mb-6">Descriptive statistics are used to describe, show, or summarize data in a meaningful way such that, for example, patterns might emerge from the data. It focuses on the characteristics of the data set you are currently looking at.</p>
<div class="my-6 border-l-4 border-white bg-white/5 p-6 rounded-r-2xl text-left">
  <h4 class="text-white font-bold text-sm mb-3">Examples</h4>
  <p class="text-slate-350 text-sm leading-relaxed mb-0">Calculating the average (mean) score of a class, the range of salaries in a company, or creating a chart showing sales trends.</p>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">1.7.2 Inferential Statistics</h3>
<p class="text-slate-300 leading-relaxed mb-6">Inferential statistics allows you to make predictions or "inferences" from that data. With inferential statistics, you take data from samples and make generalizations about a larger population.</p>
<h2 class="text-2xl font-extrabold text-white mt-12 mb-6 border-b border-white/10 pb-2">1.8 Types of Data</h2>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">1.8.1 Qualitative Data</h3>
<p class="text-slate-300 leading-relaxed mb-6">Also known as categorical data, qualitative data describes characteristics that fit into specific categories rather than numerical values.</p>
<p class="text-slate-300 leading-relaxed mb-6">Examples: Eye Color, Country Name, Phone Type, Car Brand etc.</p>
<p class="text-slate-300 leading-relaxed mb-6">Examples: Ranking of users in a competition, Rating of a product taken by the company on a scale of 1-10, Economic status: low, medium, and high.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">1.8.2 Quantitative Data</h3>
<p class="text-slate-300 leading-relaxed mb-6">Also known as numerical data, quantitative data represents numerical values that answer questions like "how much," "how often," or "how many."</p>
<h2 class="text-2xl font-extrabold text-white mt-12 mb-6 border-b border-white/10 pb-2">1.9 Structured and Unstructured Data</h2>
<div class="my-6 text-left space-y-4">
  
  <ul class="space-y-3" style="list-style-type: none; padding-left: 0;">
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Fits into rows and columns</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Includes discrete data types (numbers, dates, short text)</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Easier to analyze and interpret</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Often stored in databases or spreadsheets</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Examples: Names, phone numbers, banking information</span>
    </li>
  </ul>
</div>
<div class="my-6 text-left space-y-4">
  
  <ul class="space-y-3" style="list-style-type: none; padding-left: 0;">
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Has no fixed schema</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Complex formats like audio files and web pages</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>More difficult to analyze</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Often stored in data lakes or file systems</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Examples: Emails, social media posts, images</span>
    </li>
  </ul>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Structured Data</h3>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Unstructured Data</h3>
<h2 class="text-2xl font-extrabold text-white mt-12 mb-6 border-b border-white/10 pb-2">1.10 Raw Data, Meta Data and Big Data</h2>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">1.10.1 Raw Data</h3>
<p class="text-slate-300 leading-relaxed mb-6">Raw Data (also known as "primary data" or "atomic data") is data in its most basic form, exactly as it was collected before any cleaning, filtering, or analysis has occurred.</p>
<div class="my-6 border-l-4 border-brand bg-brand/5 p-6 rounded-r-2xl text-left">
  <h4 class="text-white font-bold text-sm mb-3">Unprocessed</h4>
  <ul class="space-y-3" style="list-style-type: none; padding-left: 0;">
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Unprocessed: No calculations (like averages or totals) have been performed.</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Full of "Noise": It often contains errors, duplicates, missing values, or irrelevant symbols.</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>High Volume: Because nothing has been filtered out, raw data takes up the most storage space.</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Objective: It is a direct record of an event (e.g., a sensor reading) without any human interpretation.</span>
    </li>
  </ul>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">1.10.2 Meta Data</h3>
<p class="text-slate-300 leading-relaxed mb-6">Metadata is essentially "data about data." It provides information about other data, making it easier to understand, organize, and use that data. Metadata can describe the structure, context, and characteristics of the data.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">1.10.3 Big Data</h3>
<h2 class="text-2xl font-extrabold text-white mt-12 mb-6 border-b border-white/10 pb-2">Practice Check: Data Categories</h2>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-9ksrnhh" data-questions="[{&quot;text&quot;:&quot;Which of the following is considered \&quot;Unstructured Data\&quot;?&quot;,&quot;options&quot;:[&quot;A SQL database table with rows and columns&quot;,&quot;A social media post containing text and an image&quot;,&quot;An Excel spreadsheet of monthly expenses&quot;,&quot;A bank statement in CSV format&quot;],&quot;correct&quot;:&quot;1&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. Which of the following is considered &quot;Unstructured Data&quot;?</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>A SQL database table with rows and columns</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="1" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''1'');
          ">
            <span>A social media post containing text and an image</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="2" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''2'');
          ">
            <span>An Excel spreadsheet of monthly expenses</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="3" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''3'');
          ">
            <span>A bank statement in CSV format</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-9ksrnhh'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-nnfiorn" data-questions="[{&quot;text&quot;:&quot;Metadata is best defined as:&quot;,&quot;options&quot;:[&quot;Data that has been deleted from a system&quot;,&quot;\&quot;Data about data\&quot; that describes its characteristics&quot;,&quot;Encrypted data used for security purposes&quot;,&quot;Large datasets that require supercomputers to process&quot;],&quot;correct&quot;:&quot;1&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. Metadata is best defined as:</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>Data that has been deleted from a system</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="1" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''1'');
          ">
            <span>&quot;Data about data&quot; that describes its characteristics</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="2" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''2'');
          ">
            <span>Encrypted data used for security purposes</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="3" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''3'');
          ">
            <span>Large datasets that require supercomputers to process</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-nnfiorn'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-kqlm85n" data-questions="[{&quot;text&quot;:&quot;What is a primary characteristic of \&quot;Raw Data\&quot;?&quot;,&quot;options&quot;:[&quot;It is already cleaned and ready for final analysis&quot;,&quot;It takes up very little storage space&quot;,&quot;It is unprocessed and full of \&quot;noise\&quot; (errors or duplicates)&quot;,&quot;It has been interpreted by humans to remove bias&quot;],&quot;correct&quot;:&quot;2&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. What is a primary characteristic of &quot;Raw Data&quot;?</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>It is already cleaned and ready for final analysis</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="1" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''1'');
          ">
            <span>It takes up very little storage space</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="2" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''2'');
          ">
            <span>It is unprocessed and full of &quot;noise&quot; (errors or duplicates)</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="3" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''3'');
          ">
            <span>It has been interpreted by humans to remove bias</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-kqlm85n'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<p class="text-slate-300 leading-relaxed mb-6">Test your knowledge of data types, structures, metadata, and the basic principles of big data.</p>
',
  1
) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, kind = EXCLUDED.kind, content_html = EXCLUDED.content_html, display_order = EXCLUDED.display_order;
INSERT INTO public.lessons (id, module_id, title, kind, content_html, display_order)
VALUES (
  '5cb7a4e2-d9f1-487b-aa58-c2b694b8e201',
  '7a2e84cf-81b4-4e9b-a01c-6d9b3a0f7e01',
  'Module 1 Assessment',
  'assessment',
  '',
  2
) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, kind = EXCLUDED.kind, content_html = EXCLUDED.content_html, display_order = EXCLUDED.display_order;
INSERT INTO public.lessons (id, module_id, title, kind, content_html, display_order)
VALUES (
  '1e92c4b7-5d03-49ef-b32f-7798ef1a4c02',
  '7a2e84cf-81b4-4e9b-a01c-6d9b3a0f7e02',
  'Spreadsheets & Modeling - Textbook',
  'material',
  '<!-- KVJ_MATERIAL_METADATA: {"type":"document","blocks":[{"id":"0fmdjf8","type":"heading","text":"Data Manipulation"},{"id":"kphirs9","type":"paragraph","text":"Data Manipulation is the process of changing, organizing, or transforming data to make it easier to read or more useful for analysis."},{"id":"fhv31ki","type":"paragraph","text":"If Raw Data is the unorganized pile of facts, and Data Analysis is the act of finding insights, then Data Manipulation is the \"manual labor\" of sorting, filtering, and rearranging that pile so the analysis can actually happen."},{"id":"qfiwxd4","type":"paragraph","text":"These data manipulation techniques are crucial for data preparation and analysis in various domains, from business analytics to data science and machine learning. They help ensure data quality, consistency, and usability for decision-making and reporting."},{"id":"do7bepv","type":"subheading","text":"Key Goals of Data Manipulation"},{"id":"zulmxpl","type":"list","title":"","points":["Consistency: Ensuring all dates, currencies, and names are in the same format (e.g., changing \"Jan 1st\" and \"01/01\" all to \"2026-01-01\").","Focus: Removing data that isn''t relevant to your current goal so you can work faster.","Structure: Rearranging data into rows and columns (or different Python data structures like Dictionaries or Lists).","Creation: Generating new data points from existing ones (e.g., taking \"Birth Date\" and creating an \"Age\" column)."]},{"id":"kspy8hy","type":"heading","text":"2.1 Extract Transform and Load (ETL)"},{"id":"t7vuaoe","type":"subheading","text":"Fundamental Understanding of ETL"},{"id":"tmjlpjw","type":"paragraph","text":"ETL is a process used in data management to extract data from various sources, transform it into a consistent format, and load it into a destination such as a data warehouse or a database. It involves the following steps:"},{"id":"3mmscq8","type":"subheading","text":"Extract"},{"id":"y1rtlat","type":"paragraph","text":"Raw data is copied or exported from source locations to a staging area during data extraction."},{"id":"5zb9ha4","type":"subheading","text":"Transform"},{"id":"xmdlhj3","type":"paragraph","text":"In this stage, raw data undergoes data processing. Here data is processed and consolidated for its intended analytical use case."},{"id":"9ln7qnh","type":"subheading","text":"Load"},{"id":"210qnya","type":"paragraph","text":"The converted data is moved from the staging area into the target area warehouse in the final stage."},{"id":"7f7oaiq","type":"heading","text":"2.2 Common Data File Format"},{"id":"t2qm1f1","type":"paragraph","text":"In data analytics, data is often stored and exchanged in various file formats. Each format has its own strengths and is chosen based on the nature of the data and the intended use."},{"id":"n2qme05","type":"subheading","text":"CSV (Comma Separated Values)"},{"id":"mu86tvr","type":"paragraph","text":"Stands for Comma Separated Values, a plain file that includes data separated by comma(,). It looks similar to an Excel file and is used to import or export huge volumes of data."},{"id":"42je0qc","type":"subheading","text":"XML (Extensible Markup Language)"},{"id":"j0u134g","type":"paragraph","text":"An XML file is a plain text file that uses custom tags to describe the structure of a document. It has the file extension .xml and is highly flexible for representing complex data structures."},{"id":"nv8vmh3","type":"subheading","text":"JSON (JavaScript Object Notation)"},{"id":"m7k8hdb","type":"paragraph","text":"A JSON file stores data in a human-readable, text-based format using name-value pairs and arrays. It is commonly used for transferring data between web applications and servers."},{"id":"ky2hday","type":"subheading","text":"Excel (.xls, .xlsx)"},{"id":"zghqvla","type":"paragraph","text":"Microsoft Excel files are used for complex data analysis, calculations, and reporting. They support multiple sheets, formulas, and visual elements like charts and pivot tables."},{"id":"hfewq2e","type":"table","headers":["Column A","Column B"],"rows":[["Name","Age","City"],["John","25","New York"],["Sara","30","London"]]},{"id":"yaui3ob","type":"subheading","text":"PDF (Portable Document Format)"},{"id":"sj6zxj6","type":"paragraph","text":"Portable Document Format files are used to present documents in a fixed layout. They are widely used for distributing read-only reports and summaries that look the same on all devices."},{"id":"5bmfq1v","type":"paragraph","text":"This document contains the summary of employees and their respective locations as of 2024."},{"id":"q36spfw","type":"table","headers":["Column A","Column B"],"rows":[["NAME","AGE","CITY"],["John","25","New York"],["Sara","30","London"]]},{"id":"25mte74","type":"heading","text":"Practice Check: ETL & File Formats"},{"id":"ocerw8u","type":"assessment","title":"Practice Check","questions":[{"text":"In the ''Extract'' stage of ETL, what is a common challenge when dealing with multiple source systems like CRM, ERP, and legacy flat files?","options":["Data must be converted to Python code immediately","Source systems may have different data formats and structures that need consolidation","Extraction always deletes the data from the source system to save space","Only cloud-based data can be extracted using ETL tools"],"correct":"1"}]},{"id":"8z3fef5","type":"assessment","title":"Practice Check","questions":[{"text":"Which loading strategy involves adding only the records that have been created or changed since the last execution to the data warehouse?","options":["Full Load","Initial Load","Incremental Load","Static Load"],"correct":"2"}]},{"id":"0sesnaz","type":"heading","text":"2.3 Data Cleaning"},{"id":"2dpw4qh","type":"paragraph","text":"Data cleaning, also known as data cleansing or data scrubbing, is the process of identifying and correcting errors and inconsistencies in raw datasets to improve data quality."},{"id":"hsj6rpf","type":"paragraph","text":"Ensuring data is accurate, complete, consistent, and usable is critical for reliable analysis or decision-making. Without cleaning, even the most advanced analysis can lead to \"Garbage In, Garbage Out.\""},{"id":"4wce86r","type":"heading","text":"Practice Check: Data Cleaning"},{"id":"a46pk9v","type":"assessment","title":"Practice Check","questions":[{"text":"When a dataset has a column with many outliers (extreme values), which imputation method is generally preferred to fill missing values?","options":["Mean Imputation","Median Imputation","Zero Imputation","Drop the column"],"correct":"1"}]},{"id":"5myt554","type":"assessment","title":"Practice Check","questions":[{"text":"In which library in Python is commonly used with Regular Expressions (Regex) to find and replace special characters in a string?","options":["math","pandas","re","json"],"correct":"2"}]},{"id":"wm9tdgp","type":"assessment","title":"Practice Check","questions":[{"text":"Which string method in Python is used to remove both leading and trailing white spaces from a text variable?","options":[".remove()",".strip()",".clean()",".trim()"],"correct":"1"}]},{"id":"rwpf7qp","type":"heading","text":"2.4 Data Organizing"},{"id":"pon8wd5","type":"paragraph","text":"2.3 Organize Data"},{"id":"shwv5gn","type":"subheading","text":"Sorting"},{"id":"5k9n7im","type":"paragraph","text":"Reordering data based on one or more columns, usually in ascending or descending order to facilitate trend analysis."},{"id":"jhpirp9","type":"subheading","text":"Practical Example"},{"id":"kok4cfd","type":"table","headers":["Product","Price"],"rows":[]},{"id":"1z50lrt","type":"subheading","text":"Filtering"},{"id":"9r9ef12","type":"paragraph","text":"Selecting a subset of data based on specified criteria or conditions to focus on relevant information."},{"id":"9vcm8ib","type":"subheading","text":"Practical Example"},{"id":"l10fv3x","type":"table","headers":["Product","Category"],"rows":[]},{"id":"qte586q","type":"subheading","text":"Slicing"},{"id":"a11o8im","type":"paragraph","text":"Extracting a specified range or portion of the data using index positions for sampling."},{"id":"fo3zal3","type":"subheading","text":"Practical Example"},{"id":"9gzgien","type":"table","headers":["ID","Data Point"],"rows":[]},{"id":"zia0np9","type":"subheading","text":"Transposing"},{"id":"jyjv60t","type":"paragraph","text":"Changing the orientation of data, such as converting rows to columns or vice versa."},{"id":"v1bajlk","type":"subheading","text":"Practical Example"},{"id":"33ifgeu","type":"table","headers":["Column A","Column B"],"rows":[]},{"id":"x7vbv8g","type":"subheading","text":"Appending"},{"id":"fc2xiei","type":"paragraph","text":"Combining or adding new data points or records to the end of an existing dataset."},{"id":"pgtkzgq","type":"subheading","text":"Practical Example"},{"id":"w24k9ll","type":"table","headers":["User ID","Status"],"rows":[]},{"id":"3kx03q2","type":"subheading","text":"Truncating"},{"id":"posyo7l","type":"paragraph","text":"Reducing the data to a specific length or number of rows for performance optimization."},{"id":"0c37emz","type":"subheading","text":"Practical Example"},{"id":"7npkwza","type":"table","headers":["ID","Name","Email"],"rows":[]},{"id":"kbpfvv1","type":"subheading","text":"Merging"},{"id":"w8pfag2","type":"paragraph","text":"Fusing disparate data sources into a unified entity through relational join keys."},{"id":"4doydz1","type":"subheading","text":"Practical Example"},{"id":"mot0mbb","type":"table","headers":["ID","Name"],"rows":[["1","Alice"],["2","Bob"]]},{"id":"8uik30c","type":"table","headers":["ID","Amt"],"rows":[["1","$450"],["2","$120"]]},{"id":"v1a7m8e","type":"table","headers":["ID","Name","Amt"],"rows":[]},{"id":"f2ef5e2","type":"heading","text":"Practice Check: Data Organizing"},{"id":"gzuxj7y","type":"assessment","title":"Practice Check","questions":[{"text":"You need to organize a list of employee names in reverse alphabetical order (Z to A). Which sorting method is required?","options":["Ascending Order","Descending Order","Random Sorting"],"correct":"1"}]},{"id":"q7nvpmt","type":"assessment","title":"Practice Check","questions":[{"text":"You have a report where ''Year'' is currently the row header and ''Region'' is the column header. You need to flip the report so ''Region'' becomes the rows and ''Year'' becomes the columns. Which operation should you use?","options":["Filtering","Transposing","Merging"],"correct":"1"}]},{"id":"1oyqvjb","type":"assessment","title":"Practice Check","questions":[{"text":"At the end of each day, you add new sales records to the bottom of your master ''Sales_History'' file. This process of adding new rows to an existing dataset is known as:","options":["Appending","Merging","Slicing"],"correct":"0"}]},{"id":"68ciutl","type":"assessment","title":"Practice Check","questions":[{"text":"You are working with a massive dataset of 5 million records. To test your logic quickly, you decide to only use the top 100 rows. what is this technique called?","options":["Transposing","Truncating","Sorting"],"correct":"1"}]},{"id":"4mnx0o2","type":"assessment","title":"Practice Check","questions":[{"text":"You want to connect a ''Customer'' table with an ''Orders'' table. Both tables must share a specific piece of information to link the records correctly. what is this shared information called?","options":["A Filter","A Relational Key (or Common ID)","A Summary Row"],"correct":"1"}]},{"id":"ervycrn","type":"heading","text":"2.5 Data Aggregation"},{"id":"gumirqg","type":"paragraph","text":"Aggregate Functions are mathematical operations performed on a collection of values (a set of data) that return a single, summarizing value."},{"id":"w5tkte2","type":"paragraph","text":"In the context of our data-to-knowledge journey, aggregate functions are the primary tools used during the Data Manipulation and Analysis stages to turn raw lists into meaningful Information."},{"id":"cn5iva6","type":"subheading","text":"2.5.1 Grouping (SUM)"},{"id":"9k5svac","type":"paragraph","text":"Grouping SUM is an aggregation function that calculates the sum of a specific numerical column within each group. When you group data by one or more columns, you can apply the SUM function to find the total sum of a particular numerical value for each group."},{"id":"so1sqnv","type":"table","headers":["Category","Amount"],"rows":[["Electronics","500"],["Clothing","200"],["Electronics","300"],["Clothing","150"],["Electronics","700"]]},{"id":"5lc015l","type":"subheading","text":"Python Implementation (Pandas)"},{"id":"cb1mrb1","type":"table","headers":["Category","Amount"],"rows":[["Clothing","350"],["Electronics","1500"]]},{"id":"2qglefa","type":"subheading","text":"2.5.2 Grouping (COUNT)"},{"id":"rrzwtqf","type":"paragraph","text":"Grouping COUNT is an aggregation function that counts the number of rows within each group. It is used to determine how many items fall into each group."},{"id":"0inf113","type":"table","headers":["Category","Transaction ID"],"rows":[["Electronics","TXN_001"],["Electronics","TXN_002"],["Clothing","TXN_003"],["Electronics","TXN_004"],["Clothing","TXN_005"],["Electronics","TXN_006"],["Electronics","TXN_007"]]},{"id":"nxvvq6b","type":"subheading","text":"Python Implementation (Pandas)"},{"id":"mp9jtro","type":"table","headers":["Category","Count"],"rows":[["Clothing","2"],["Electronics","5"]]},{"id":"mlsnolb","type":"subheading","text":"2.5.3 Grouping (AVG)"},{"id":"kbwg5k7","type":"paragraph","text":"Grouping AVG is an aggregation function that calculates the average(mean) of a specific numerical column within each group. This function provides the average value of the data in each group."},{"id":"ryusqpr","type":"table","headers":["Category","Price"],"rows":[["Electronics","400"],["Clothing","200"],["Electronics","600"],["Clothing","100"],["Electronics","500"]]},{"id":"yvt1l1u","type":"subheading","text":"Python Implementation (Pandas)"},{"id":"bq9vjal","type":"table","headers":["Category","Mean"],"rows":[["Clothing","150.0"],["Electronics","500.0"]]},{"id":"1emzcfz","type":"subheading","text":"2.5.4 Grouping (MAX)"},{"id":"rc032cu","type":"paragraph","text":"Grouping MAX is an aggregation function that identifies the highest value within each group. It is useful for finding top performers or peak values within specific categories."},{"id":"ucjm889","type":"table","headers":["Category","Score"],"rows":[["Electronics","800"],["Clothing","400"],["Electronics","600"],["Clothing","450"],["Electronics","700"]]},{"id":"15t9540","type":"subheading","text":"Python Implementation (Pandas)"},{"id":"yzkr6tj","type":"table","headers":["Category","Max"],"rows":[["Clothing","450"],["Electronics","800"]]},{"id":"7a4hb2b","type":"subheading","text":"2.5.5 Grouping (MIN)"},{"id":"pz9nzyn","type":"paragraph","text":"Grouping MIN is an aggregation function that identifies the lowest value within each group. It is useful for finding minimum thresholds or cost floors for different data segments."},{"id":"1oyu82h","type":"table","headers":["Category","Cost"],"rows":[["Electronics","300"],["Clothing","100"],["Electronics","200"],["Clothing","150"],["Electronics","250"]]},{"id":"ziodc1u","type":"subheading","text":"Python Implementation (Pandas)"},{"id":"j23crwb","type":"table","headers":["Category","Min"],"rows":[["Clothing","100"],["Electronics","200"]]},{"id":"zf77aos","type":"subheading","text":"2.5.6 Grouping (MODE)"},{"id":"gsua4eb","type":"paragraph","text":"Grouping MODE is an aggregation function that identifies the most frequent value within each group. It is useful for finding common behaviors or preferences within specific categories."},{"id":"q68wy26","type":"table","headers":["Category","Value"],"rows":[["Electronics","500"],["Clothing","200"],["Electronics","500"],["Clothing","200"],["Electronics","500"]]},{"id":"1sd5791","type":"subheading","text":"Python Implementation (Pandas)"},{"id":"5s64ta2","type":"table","headers":["Category","Mode"],"rows":[["Clothing","200"],["Electronics","500"]]},{"id":"xhm2frc","type":"heading","text":"2.6 Summarizing"},{"id":"qwtkg48","type":"paragraph","text":"Summarizing is the process of taking many rows of data and using Aggregate Functions (like SUM, AVG, or COUNT) to turn them into a few key numbers. It collapses the data vertically."},{"id":"gn4dl0d","type":"subheading","text":"Practical Example:"},{"id":"sl7smxb","type":"paragraph","text":"Raw Data: 100 rows of individual student test scores."},{"id":"hqnzwqv","type":"paragraph","text":"Summarized Data: One single number—the Average Score (78%)."},{"id":"23m62qu","type":"subheading","text":"Python Implementation (Pandas)"},{"id":"8f5zelc","type":"table","headers":["Column A","Column B"],"rows":[["","Amount"],["count","5.000000"],["mean","370.000000"],["std","228.035085"],["min","150.000000"],["25%","200.000000"],["50%","300.000000"],["75%","500.000000"],["max","700.000000"]]},{"id":"6j26ez5","type":"heading","text":"2.7 Pivoting"},{"id":"dqb38gd","type":"paragraph","text":"Pivoting is the process of reorganizing or reshaping data to view it from a different perspective, usually to make analysis easier and more meaningful."},{"id":"nvu7mpy","type":"subheading","text":"Common Uses in Data Analytics:"},{"id":"cor6yso","type":"list","title":"","points":["Summarize large datasets for quick insights","Convert rows into columns (or vice versa)","Create structured reports for better insights"]},{"id":"b18gzxs","type":"subheading","text":"Python Implementation (Pandas)"},{"id":"ruydetp","type":"table","headers":["Column A","Column B"],"rows":[["Amount","150","200","300","500","700"],["Category",""],["Clothing","150.0","200.0","NaN","NaN","NaN"],["Electronics","NaN","NaN","300.0","500.0","700.0"]]},{"id":"a4czcwi","type":"paragraph","text":"Drag fields to build, filter, and analyze your dataset live."},{"id":"i070vx7","type":"table","headers":["Reg","Cat","Yr","Sales"],"rows":[]},{"id":"96hfl05","type":"heading","text":"Knowledge Check: Data Manipulation"},{"id":"qmzgvfb","type":"assessment","title":"Practice Check","questions":[{"text":"Question","options":["COUNT","SUM","AVG","MAX"],"correct":"1"}]},{"id":"3oc1tf1","type":"assessment","title":"Practice Check","questions":[{"text":"Question","options":["It expands the data horizontally by adding more columns.","It hides columns that contain categorical data.","It collapses many rows into a few key \"bottom-line\" numbers.","It sorts the data in descending order automatically."],"correct":"2"}]},{"id":"svryr5i","type":"assessment","title":"Practice Check","questions":[{"text":"Question","options":["df.info()","df.head()","df.describe()","df.summarize()"],"correct":"2"}]},{"id":"kf5fg1u","type":"assessment","title":"Practice Check","questions":[{"text":"Question","options":["SUM","COUNT","AVG","MIN"],"correct":"1"}]},{"id":"0oais06","type":"assessment","title":"Practice Check","questions":[{"text":"Question","options":["Delete duplicate rows from the dataset.","Reshape data by converting rows into columns for structured reports.","Sort data based on alphabetical order.","Fill in missing values with the mean of the column."],"correct":"1"}]},{"id":"4otbpa1","type":"paragraph","text":"Test your knowledge of the ETL process and common data file formats."}]} -->
<h2 class="text-2xl font-extrabold text-white mt-12 mb-6 border-b border-white/10 pb-2">Data Manipulation</h2>
<p class="text-slate-300 leading-relaxed mb-6">Data Manipulation is the process of changing, organizing, or transforming data to make it easier to read or more useful for analysis.</p>
<p class="text-slate-300 leading-relaxed mb-6">If Raw Data is the unorganized pile of facts, and Data Analysis is the act of finding insights, then Data Manipulation is the "manual labor" of sorting, filtering, and rearranging that pile so the analysis can actually happen.</p>
<p class="text-slate-300 leading-relaxed mb-6">These data manipulation techniques are crucial for data preparation and analysis in various domains, from business analytics to data science and machine learning. They help ensure data quality, consistency, and usability for decision-making and reporting.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Key Goals of Data Manipulation</h3>
<div class="my-6 text-left space-y-4">
  
  <ul class="space-y-3" style="list-style-type: none; padding-left: 0;">
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Consistency: Ensuring all dates, currencies, and names are in the same format (e.g., changing "Jan 1st" and "01/01" all to "2026-01-01").</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Focus: Removing data that isn''t relevant to your current goal so you can work faster.</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Structure: Rearranging data into rows and columns (or different Python data structures like Dictionaries or Lists).</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Creation: Generating new data points from existing ones (e.g., taking "Birth Date" and creating an "Age" column).</span>
    </li>
  </ul>
</div>
<h2 class="text-2xl font-extrabold text-white mt-12 mb-6 border-b border-white/10 pb-2">2.1 Extract Transform and Load (ETL)</h2>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Fundamental Understanding of ETL</h3>
<p class="text-slate-300 leading-relaxed mb-6">ETL is a process used in data management to extract data from various sources, transform it into a consistent format, and load it into a destination such as a data warehouse or a database. It involves the following steps:</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Extract</h3>
<p class="text-slate-300 leading-relaxed mb-6">Raw data is copied or exported from source locations to a staging area during data extraction.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Transform</h3>
<p class="text-slate-300 leading-relaxed mb-6">In this stage, raw data undergoes data processing. Here data is processed and consolidated for its intended analytical use case.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Load</h3>
<p class="text-slate-300 leading-relaxed mb-6">The converted data is moved from the staging area into the target area warehouse in the final stage.</p>
<h2 class="text-2xl font-extrabold text-white mt-12 mb-6 border-b border-white/10 pb-2">2.2 Common Data File Format</h2>
<p class="text-slate-300 leading-relaxed mb-6">In data analytics, data is often stored and exchanged in various file formats. Each format has its own strengths and is chosen based on the nature of the data and the intended use.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">CSV (Comma Separated Values)</h3>
<p class="text-slate-300 leading-relaxed mb-6">Stands for Comma Separated Values, a plain file that includes data separated by comma(,). It looks similar to an Excel file and is used to import or export huge volumes of data.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">XML (Extensible Markup Language)</h3>
<p class="text-slate-300 leading-relaxed mb-6">An XML file is a plain text file that uses custom tags to describe the structure of a document. It has the file extension .xml and is highly flexible for representing complex data structures.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">JSON (JavaScript Object Notation)</h3>
<p class="text-slate-300 leading-relaxed mb-6">A JSON file stores data in a human-readable, text-based format using name-value pairs and arrays. It is commonly used for transferring data between web applications and servers.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Excel (.xls, .xlsx)</h3>
<p class="text-slate-300 leading-relaxed mb-6">Microsoft Excel files are used for complex data analysis, calculations, and reporting. They support multiple sheets, formulas, and visual elements like charts and pivot tables.</p>
<div class="my-8 overflow-x-auto rounded-2xl border border-white/10 shadow-soft bg-[#0B2A22]/40">
  <table class="w-full text-sm text-left">
    <thead class="bg-white/5 border-b border-white/10">
      <tr>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Column A</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Column B</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/5">
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Name</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Age</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">City</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">John</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">25</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">New York</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Sara</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">30</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">London</td>
    </tr>
    </tbody>
  </table>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">PDF (Portable Document Format)</h3>
<p class="text-slate-300 leading-relaxed mb-6">Portable Document Format files are used to present documents in a fixed layout. They are widely used for distributing read-only reports and summaries that look the same on all devices.</p>
<p class="text-slate-300 leading-relaxed mb-6">This document contains the summary of employees and their respective locations as of 2024.</p>
<div class="my-8 overflow-x-auto rounded-2xl border border-white/10 shadow-soft bg-[#0B2A22]/40">
  <table class="w-full text-sm text-left">
    <thead class="bg-white/5 border-b border-white/10">
      <tr>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Column A</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Column B</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/5">
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">NAME</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">AGE</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">CITY</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">John</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">25</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">New York</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Sara</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">30</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">London</td>
    </tr>
    </tbody>
  </table>
</div>
<h2 class="text-2xl font-extrabold text-white mt-12 mb-6 border-b border-white/10 pb-2">Practice Check: ETL & File Formats</h2>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-dg167ax" data-questions="[{&quot;text&quot;:&quot;In the ''Extract'' stage of ETL, what is a common challenge when dealing with multiple source systems like CRM, ERP, and legacy flat files?&quot;,&quot;options&quot;:[&quot;Data must be converted to Python code immediately&quot;,&quot;Source systems may have different data formats and structures that need consolidation&quot;,&quot;Extraction always deletes the data from the source system to save space&quot;,&quot;Only cloud-based data can be extracted using ETL tools&quot;],&quot;correct&quot;:&quot;1&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. In the &#39;Extract&#39; stage of ETL, what is a common challenge when dealing with multiple source systems like CRM, ERP, and legacy flat files?</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>Data must be converted to Python code immediately</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="1" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''1'');
          ">
            <span>Source systems may have different data formats and structures that need consolidation</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="2" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''2'');
          ">
            <span>Extraction always deletes the data from the source system to save space</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="3" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''3'');
          ">
            <span>Only cloud-based data can be extracted using ETL tools</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-dg167ax'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-8uo6000" data-questions="[{&quot;text&quot;:&quot;Which loading strategy involves adding only the records that have been created or changed since the last execution to the data warehouse?&quot;,&quot;options&quot;:[&quot;Full Load&quot;,&quot;Initial Load&quot;,&quot;Incremental Load&quot;,&quot;Static Load&quot;],&quot;correct&quot;:&quot;2&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. Which loading strategy involves adding only the records that have been created or changed since the last execution to the data warehouse?</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>Full Load</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="1" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''1'');
          ">
            <span>Initial Load</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="2" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''2'');
          ">
            <span>Incremental Load</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="3" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''3'');
          ">
            <span>Static Load</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-8uo6000'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<h2 class="text-2xl font-extrabold text-white mt-12 mb-6 border-b border-white/10 pb-2">2.3 Data Cleaning</h2>
<p class="text-slate-300 leading-relaxed mb-6">Data cleaning, also known as data cleansing or data scrubbing, is the process of identifying and correcting errors and inconsistencies in raw datasets to improve data quality.</p>
<p class="text-slate-300 leading-relaxed mb-6">Ensuring data is accurate, complete, consistent, and usable is critical for reliable analysis or decision-making. Without cleaning, even the most advanced analysis can lead to "Garbage In, Garbage Out."</p>
<h2 class="text-2xl font-extrabold text-white mt-12 mb-6 border-b border-white/10 pb-2">Practice Check: Data Cleaning</h2>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-76lggm8" data-questions="[{&quot;text&quot;:&quot;When a dataset has a column with many outliers (extreme values), which imputation method is generally preferred to fill missing values?&quot;,&quot;options&quot;:[&quot;Mean Imputation&quot;,&quot;Median Imputation&quot;,&quot;Zero Imputation&quot;,&quot;Drop the column&quot;],&quot;correct&quot;:&quot;1&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. When a dataset has a column with many outliers (extreme values), which imputation method is generally preferred to fill missing values?</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>Mean Imputation</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="1" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''1'');
          ">
            <span>Median Imputation</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="2" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''2'');
          ">
            <span>Zero Imputation</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="3" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''3'');
          ">
            <span>Drop the column</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-76lggm8'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-z7lmhbq" data-questions="[{&quot;text&quot;:&quot;In which library in Python is commonly used with Regular Expressions (Regex) to find and replace special characters in a string?&quot;,&quot;options&quot;:[&quot;math&quot;,&quot;pandas&quot;,&quot;re&quot;,&quot;json&quot;],&quot;correct&quot;:&quot;2&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. In which library in Python is commonly used with Regular Expressions (Regex) to find and replace special characters in a string?</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>math</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="1" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''1'');
          ">
            <span>pandas</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="2" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''2'');
          ">
            <span>re</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="3" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''3'');
          ">
            <span>json</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-z7lmhbq'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-8sdw29v" data-questions="[{&quot;text&quot;:&quot;Which string method in Python is used to remove both leading and trailing white spaces from a text variable?&quot;,&quot;options&quot;:[&quot;.remove()&quot;,&quot;.strip()&quot;,&quot;.clean()&quot;,&quot;.trim()&quot;],&quot;correct&quot;:&quot;1&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. Which string method in Python is used to remove both leading and trailing white spaces from a text variable?</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>.remove()</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="1" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''1'');
          ">
            <span>.strip()</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="2" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''2'');
          ">
            <span>.clean()</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="3" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''3'');
          ">
            <span>.trim()</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-8sdw29v'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<h2 class="text-2xl font-extrabold text-white mt-12 mb-6 border-b border-white/10 pb-2">2.4 Data Organizing</h2>
<p class="text-slate-300 leading-relaxed mb-6">2.3 Organize Data</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Sorting</h3>
<p class="text-slate-300 leading-relaxed mb-6">Reordering data based on one or more columns, usually in ascending or descending order to facilitate trend analysis.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Practical Example</h3>
<div class="my-8 overflow-x-auto rounded-2xl border border-white/10 shadow-soft bg-[#0B2A22]/40">
  <table class="w-full text-sm text-left">
    <thead class="bg-white/5 border-b border-white/10">
      <tr>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Product</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Price</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/5">

    </tbody>
  </table>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Filtering</h3>
<p class="text-slate-300 leading-relaxed mb-6">Selecting a subset of data based on specified criteria or conditions to focus on relevant information.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Practical Example</h3>
<div class="my-8 overflow-x-auto rounded-2xl border border-white/10 shadow-soft bg-[#0B2A22]/40">
  <table class="w-full text-sm text-left">
    <thead class="bg-white/5 border-b border-white/10">
      <tr>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Product</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Category</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/5">

    </tbody>
  </table>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Slicing</h3>
<p class="text-slate-300 leading-relaxed mb-6">Extracting a specified range or portion of the data using index positions for sampling.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Practical Example</h3>
<div class="my-8 overflow-x-auto rounded-2xl border border-white/10 shadow-soft bg-[#0B2A22]/40">
  <table class="w-full text-sm text-left">
    <thead class="bg-white/5 border-b border-white/10">
      <tr>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">ID</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Data Point</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/5">

    </tbody>
  </table>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Transposing</h3>
<p class="text-slate-300 leading-relaxed mb-6">Changing the orientation of data, such as converting rows to columns or vice versa.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Practical Example</h3>
<div class="my-8 overflow-x-auto rounded-2xl border border-white/10 shadow-soft bg-[#0B2A22]/40">
  <table class="w-full text-sm text-left">
    <thead class="bg-white/5 border-b border-white/10">
      <tr>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Column A</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Column B</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/5">

    </tbody>
  </table>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Appending</h3>
<p class="text-slate-300 leading-relaxed mb-6">Combining or adding new data points or records to the end of an existing dataset.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Practical Example</h3>
<div class="my-8 overflow-x-auto rounded-2xl border border-white/10 shadow-soft bg-[#0B2A22]/40">
  <table class="w-full text-sm text-left">
    <thead class="bg-white/5 border-b border-white/10">
      <tr>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">User ID</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Status</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/5">

    </tbody>
  </table>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Truncating</h3>
<p class="text-slate-300 leading-relaxed mb-6">Reducing the data to a specific length or number of rows for performance optimization.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Practical Example</h3>
<div class="my-8 overflow-x-auto rounded-2xl border border-white/10 shadow-soft bg-[#0B2A22]/40">
  <table class="w-full text-sm text-left">
    <thead class="bg-white/5 border-b border-white/10">
      <tr>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">ID</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Name</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Email</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/5">

    </tbody>
  </table>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Merging</h3>
<p class="text-slate-300 leading-relaxed mb-6">Fusing disparate data sources into a unified entity through relational join keys.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Practical Example</h3>
<div class="my-8 overflow-x-auto rounded-2xl border border-white/10 shadow-soft bg-[#0B2A22]/40">
  <table class="w-full text-sm text-left">
    <thead class="bg-white/5 border-b border-white/10">
      <tr>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">ID</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Name</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/5">
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">1</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Alice</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">2</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Bob</td>
    </tr>
    </tbody>
  </table>
</div>
<div class="my-8 overflow-x-auto rounded-2xl border border-white/10 shadow-soft bg-[#0B2A22]/40">
  <table class="w-full text-sm text-left">
    <thead class="bg-white/5 border-b border-white/10">
      <tr>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">ID</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Amt</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/5">
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">1</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">$450</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">2</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">$120</td>
    </tr>
    </tbody>
  </table>
</div>
<div class="my-8 overflow-x-auto rounded-2xl border border-white/10 shadow-soft bg-[#0B2A22]/40">
  <table class="w-full text-sm text-left">
    <thead class="bg-white/5 border-b border-white/10">
      <tr>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">ID</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Name</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Amt</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/5">

    </tbody>
  </table>
</div>
<h2 class="text-2xl font-extrabold text-white mt-12 mb-6 border-b border-white/10 pb-2">Practice Check: Data Organizing</h2>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-iqnm7qk" data-questions="[{&quot;text&quot;:&quot;You need to organize a list of employee names in reverse alphabetical order (Z to A). Which sorting method is required?&quot;,&quot;options&quot;:[&quot;Ascending Order&quot;,&quot;Descending Order&quot;,&quot;Random Sorting&quot;],&quot;correct&quot;:&quot;1&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. You need to organize a list of employee names in reverse alphabetical order (Z to A). Which sorting method is required?</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>Ascending Order</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="1" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''1'');
          ">
            <span>Descending Order</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="2" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''2'');
          ">
            <span>Random Sorting</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-iqnm7qk'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-vrq4hji" data-questions="[{&quot;text&quot;:&quot;You have a report where ''Year'' is currently the row header and ''Region'' is the column header. You need to flip the report so ''Region'' becomes the rows and ''Year'' becomes the columns. Which operation should you use?&quot;,&quot;options&quot;:[&quot;Filtering&quot;,&quot;Transposing&quot;,&quot;Merging&quot;],&quot;correct&quot;:&quot;1&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. You have a report where &#39;Year&#39; is currently the row header and &#39;Region&#39; is the column header. You need to flip the report so &#39;Region&#39; becomes the rows and &#39;Year&#39; becomes the columns. Which operation should you use?</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>Filtering</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="1" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''1'');
          ">
            <span>Transposing</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="2" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''2'');
          ">
            <span>Merging</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-vrq4hji'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-qpbprlb" data-questions="[{&quot;text&quot;:&quot;At the end of each day, you add new sales records to the bottom of your master ''Sales_History'' file. This process of adding new rows to an existing dataset is known as:&quot;,&quot;options&quot;:[&quot;Appending&quot;,&quot;Merging&quot;,&quot;Slicing&quot;],&quot;correct&quot;:&quot;0&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. At the end of each day, you add new sales records to the bottom of your master &#39;Sales_History&#39; file. This process of adding new rows to an existing dataset is known as:</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>Appending</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="1" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''1'');
          ">
            <span>Merging</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="2" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''2'');
          ">
            <span>Slicing</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-qpbprlb'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-n0iogw7" data-questions="[{&quot;text&quot;:&quot;You are working with a massive dataset of 5 million records. To test your logic quickly, you decide to only use the top 100 rows. what is this technique called?&quot;,&quot;options&quot;:[&quot;Transposing&quot;,&quot;Truncating&quot;,&quot;Sorting&quot;],&quot;correct&quot;:&quot;1&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. You are working with a massive dataset of 5 million records. To test your logic quickly, you decide to only use the top 100 rows. what is this technique called?</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>Transposing</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="1" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''1'');
          ">
            <span>Truncating</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="2" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''2'');
          ">
            <span>Sorting</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-n0iogw7'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-4hkps3s" data-questions="[{&quot;text&quot;:&quot;You want to connect a ''Customer'' table with an ''Orders'' table. Both tables must share a specific piece of information to link the records correctly. what is this shared information called?&quot;,&quot;options&quot;:[&quot;A Filter&quot;,&quot;A Relational Key (or Common ID)&quot;,&quot;A Summary Row&quot;],&quot;correct&quot;:&quot;1&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. You want to connect a &#39;Customer&#39; table with an &#39;Orders&#39; table. Both tables must share a specific piece of information to link the records correctly. what is this shared information called?</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>A Filter</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="1" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''1'');
          ">
            <span>A Relational Key (or Common ID)</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="2" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''2'');
          ">
            <span>A Summary Row</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-4hkps3s'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<h2 class="text-2xl font-extrabold text-white mt-12 mb-6 border-b border-white/10 pb-2">2.5 Data Aggregation</h2>
<p class="text-slate-300 leading-relaxed mb-6">Aggregate Functions are mathematical operations performed on a collection of values (a set of data) that return a single, summarizing value.</p>
<p class="text-slate-300 leading-relaxed mb-6">In the context of our data-to-knowledge journey, aggregate functions are the primary tools used during the Data Manipulation and Analysis stages to turn raw lists into meaningful Information.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">2.5.1 Grouping (SUM)</h3>
<p class="text-slate-300 leading-relaxed mb-6">Grouping SUM is an aggregation function that calculates the sum of a specific numerical column within each group. When you group data by one or more columns, you can apply the SUM function to find the total sum of a particular numerical value for each group.</p>
<div class="my-8 overflow-x-auto rounded-2xl border border-white/10 shadow-soft bg-[#0B2A22]/40">
  <table class="w-full text-sm text-left">
    <thead class="bg-white/5 border-b border-white/10">
      <tr>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Category</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Amount</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/5">
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Electronics</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">500</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Clothing</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">200</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Electronics</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">300</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Clothing</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">150</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Electronics</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">700</td>
    </tr>
    </tbody>
  </table>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Python Implementation (Pandas)</h3>
<div class="my-8 overflow-x-auto rounded-2xl border border-white/10 shadow-soft bg-[#0B2A22]/40">
  <table class="w-full text-sm text-left">
    <thead class="bg-white/5 border-b border-white/10">
      <tr>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Category</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Amount</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/5">
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Clothing</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">350</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Electronics</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">1500</td>
    </tr>
    </tbody>
  </table>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">2.5.2 Grouping (COUNT)</h3>
<p class="text-slate-300 leading-relaxed mb-6">Grouping COUNT is an aggregation function that counts the number of rows within each group. It is used to determine how many items fall into each group.</p>
<div class="my-8 overflow-x-auto rounded-2xl border border-white/10 shadow-soft bg-[#0B2A22]/40">
  <table class="w-full text-sm text-left">
    <thead class="bg-white/5 border-b border-white/10">
      <tr>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Category</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Transaction ID</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/5">
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Electronics</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">TXN_001</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Electronics</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">TXN_002</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Clothing</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">TXN_003</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Electronics</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">TXN_004</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Clothing</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">TXN_005</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Electronics</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">TXN_006</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Electronics</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">TXN_007</td>
    </tr>
    </tbody>
  </table>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Python Implementation (Pandas)</h3>
<div class="my-8 overflow-x-auto rounded-2xl border border-white/10 shadow-soft bg-[#0B2A22]/40">
  <table class="w-full text-sm text-left">
    <thead class="bg-white/5 border-b border-white/10">
      <tr>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Category</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Count</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/5">
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Clothing</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">2</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Electronics</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">5</td>
    </tr>
    </tbody>
  </table>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">2.5.3 Grouping (AVG)</h3>
<p class="text-slate-300 leading-relaxed mb-6">Grouping AVG is an aggregation function that calculates the average(mean) of a specific numerical column within each group. This function provides the average value of the data in each group.</p>
<div class="my-8 overflow-x-auto rounded-2xl border border-white/10 shadow-soft bg-[#0B2A22]/40">
  <table class="w-full text-sm text-left">
    <thead class="bg-white/5 border-b border-white/10">
      <tr>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Category</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Price</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/5">
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Electronics</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">400</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Clothing</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">200</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Electronics</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">600</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Clothing</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">100</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Electronics</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">500</td>
    </tr>
    </tbody>
  </table>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Python Implementation (Pandas)</h3>
<div class="my-8 overflow-x-auto rounded-2xl border border-white/10 shadow-soft bg-[#0B2A22]/40">
  <table class="w-full text-sm text-left">
    <thead class="bg-white/5 border-b border-white/10">
      <tr>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Category</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Mean</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/5">
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Clothing</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">150.0</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Electronics</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">500.0</td>
    </tr>
    </tbody>
  </table>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">2.5.4 Grouping (MAX)</h3>
<p class="text-slate-300 leading-relaxed mb-6">Grouping MAX is an aggregation function that identifies the highest value within each group. It is useful for finding top performers or peak values within specific categories.</p>
<div class="my-8 overflow-x-auto rounded-2xl border border-white/10 shadow-soft bg-[#0B2A22]/40">
  <table class="w-full text-sm text-left">
    <thead class="bg-white/5 border-b border-white/10">
      <tr>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Category</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Score</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/5">
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Electronics</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">800</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Clothing</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">400</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Electronics</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">600</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Clothing</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">450</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Electronics</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">700</td>
    </tr>
    </tbody>
  </table>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Python Implementation (Pandas)</h3>
<div class="my-8 overflow-x-auto rounded-2xl border border-white/10 shadow-soft bg-[#0B2A22]/40">
  <table class="w-full text-sm text-left">
    <thead class="bg-white/5 border-b border-white/10">
      <tr>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Category</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Max</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/5">
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Clothing</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">450</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Electronics</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">800</td>
    </tr>
    </tbody>
  </table>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">2.5.5 Grouping (MIN)</h3>
<p class="text-slate-300 leading-relaxed mb-6">Grouping MIN is an aggregation function that identifies the lowest value within each group. It is useful for finding minimum thresholds or cost floors for different data segments.</p>
<div class="my-8 overflow-x-auto rounded-2xl border border-white/10 shadow-soft bg-[#0B2A22]/40">
  <table class="w-full text-sm text-left">
    <thead class="bg-white/5 border-b border-white/10">
      <tr>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Category</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Cost</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/5">
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Electronics</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">300</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Clothing</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">100</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Electronics</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">200</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Clothing</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">150</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Electronics</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">250</td>
    </tr>
    </tbody>
  </table>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Python Implementation (Pandas)</h3>
<div class="my-8 overflow-x-auto rounded-2xl border border-white/10 shadow-soft bg-[#0B2A22]/40">
  <table class="w-full text-sm text-left">
    <thead class="bg-white/5 border-b border-white/10">
      <tr>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Category</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Min</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/5">
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Clothing</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">100</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Electronics</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">200</td>
    </tr>
    </tbody>
  </table>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">2.5.6 Grouping (MODE)</h3>
<p class="text-slate-300 leading-relaxed mb-6">Grouping MODE is an aggregation function that identifies the most frequent value within each group. It is useful for finding common behaviors or preferences within specific categories.</p>
<div class="my-8 overflow-x-auto rounded-2xl border border-white/10 shadow-soft bg-[#0B2A22]/40">
  <table class="w-full text-sm text-left">
    <thead class="bg-white/5 border-b border-white/10">
      <tr>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Category</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Value</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/5">
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Electronics</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">500</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Clothing</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">200</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Electronics</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">500</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Clothing</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">200</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Electronics</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">500</td>
    </tr>
    </tbody>
  </table>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Python Implementation (Pandas)</h3>
<div class="my-8 overflow-x-auto rounded-2xl border border-white/10 shadow-soft bg-[#0B2A22]/40">
  <table class="w-full text-sm text-left">
    <thead class="bg-white/5 border-b border-white/10">
      <tr>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Category</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Mode</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/5">
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Clothing</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">200</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Electronics</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">500</td>
    </tr>
    </tbody>
  </table>
</div>
<h2 class="text-2xl font-extrabold text-white mt-12 mb-6 border-b border-white/10 pb-2">2.6 Summarizing</h2>
<p class="text-slate-300 leading-relaxed mb-6">Summarizing is the process of taking many rows of data and using Aggregate Functions (like SUM, AVG, or COUNT) to turn them into a few key numbers. It collapses the data vertically.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Practical Example:</h3>
<p class="text-slate-300 leading-relaxed mb-6">Raw Data: 100 rows of individual student test scores.</p>
<p class="text-slate-300 leading-relaxed mb-6">Summarized Data: One single number—the Average Score (78%).</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Python Implementation (Pandas)</h3>
<div class="my-8 overflow-x-auto rounded-2xl border border-white/10 shadow-soft bg-[#0B2A22]/40">
  <table class="w-full text-sm text-left">
    <thead class="bg-white/5 border-b border-white/10">
      <tr>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Column A</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Column B</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/5">
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0"></td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Amount</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">count</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">5.000000</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">mean</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">370.000000</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">std</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">228.035085</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">min</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">150.000000</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">25%</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">200.000000</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">50%</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">300.000000</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">75%</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">500.000000</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">max</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">700.000000</td>
    </tr>
    </tbody>
  </table>
</div>
<h2 class="text-2xl font-extrabold text-white mt-12 mb-6 border-b border-white/10 pb-2">2.7 Pivoting</h2>
<p class="text-slate-300 leading-relaxed mb-6">Pivoting is the process of reorganizing or reshaping data to view it from a different perspective, usually to make analysis easier and more meaningful.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Common Uses in Data Analytics:</h3>
<div class="my-6 text-left space-y-4">
  
  <ul class="space-y-3" style="list-style-type: none; padding-left: 0;">
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Summarize large datasets for quick insights</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Convert rows into columns (or vice versa)</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Create structured reports for better insights</span>
    </li>
  </ul>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Python Implementation (Pandas)</h3>
<div class="my-8 overflow-x-auto rounded-2xl border border-white/10 shadow-soft bg-[#0B2A22]/40">
  <table class="w-full text-sm text-left">
    <thead class="bg-white/5 border-b border-white/10">
      <tr>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Column A</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Column B</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/5">
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Amount</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">150</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">200</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">300</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">500</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">700</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Category</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0"></td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Clothing</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">150.0</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">200.0</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">NaN</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">NaN</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">NaN</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Electronics</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">NaN</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">NaN</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">300.0</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">500.0</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">700.0</td>
    </tr>
    </tbody>
  </table>
</div>
<p class="text-slate-300 leading-relaxed mb-6">Drag fields to build, filter, and analyze your dataset live.</p>
<div class="my-8 overflow-x-auto rounded-2xl border border-white/10 shadow-soft bg-[#0B2A22]/40">
  <table class="w-full text-sm text-left">
    <thead class="bg-white/5 border-b border-white/10">
      <tr>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Reg</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Cat</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Yr</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Sales</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/5">

    </tbody>
  </table>
</div>
<h2 class="text-2xl font-extrabold text-white mt-12 mb-6 border-b border-white/10 pb-2">Knowledge Check: Data Manipulation</h2>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-aqag8lt" data-questions="[{&quot;text&quot;:&quot;Question&quot;,&quot;options&quot;:[&quot;COUNT&quot;,&quot;SUM&quot;,&quot;AVG&quot;,&quot;MAX&quot;],&quot;correct&quot;:&quot;1&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. Question</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>COUNT</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="1" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''1'');
          ">
            <span>SUM</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="2" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''2'');
          ">
            <span>AVG</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="3" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''3'');
          ">
            <span>MAX</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-aqag8lt'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-ql11i3o" data-questions="[{&quot;text&quot;:&quot;Question&quot;,&quot;options&quot;:[&quot;It expands the data horizontally by adding more columns.&quot;,&quot;It hides columns that contain categorical data.&quot;,&quot;It collapses many rows into a few key \&quot;bottom-line\&quot; numbers.&quot;,&quot;It sorts the data in descending order automatically.&quot;],&quot;correct&quot;:&quot;2&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. Question</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>It expands the data horizontally by adding more columns.</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="1" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''1'');
          ">
            <span>It hides columns that contain categorical data.</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="2" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''2'');
          ">
            <span>It collapses many rows into a few key &quot;bottom-line&quot; numbers.</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="3" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''3'');
          ">
            <span>It sorts the data in descending order automatically.</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-ql11i3o'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-di9dhsf" data-questions="[{&quot;text&quot;:&quot;Question&quot;,&quot;options&quot;:[&quot;df.info()&quot;,&quot;df.head()&quot;,&quot;df.describe()&quot;,&quot;df.summarize()&quot;],&quot;correct&quot;:&quot;2&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. Question</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>df.info()</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="1" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''1'');
          ">
            <span>df.head()</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="2" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''2'');
          ">
            <span>df.describe()</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="3" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''3'');
          ">
            <span>df.summarize()</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-di9dhsf'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-wsogh1i" data-questions="[{&quot;text&quot;:&quot;Question&quot;,&quot;options&quot;:[&quot;SUM&quot;,&quot;COUNT&quot;,&quot;AVG&quot;,&quot;MIN&quot;],&quot;correct&quot;:&quot;1&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. Question</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>SUM</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="1" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''1'');
          ">
            <span>COUNT</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="2" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''2'');
          ">
            <span>AVG</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="3" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''3'');
          ">
            <span>MIN</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-wsogh1i'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-bdzpo0l" data-questions="[{&quot;text&quot;:&quot;Question&quot;,&quot;options&quot;:[&quot;Delete duplicate rows from the dataset.&quot;,&quot;Reshape data by converting rows into columns for structured reports.&quot;,&quot;Sort data based on alphabetical order.&quot;,&quot;Fill in missing values with the mean of the column.&quot;],&quot;correct&quot;:&quot;1&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. Question</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>Delete duplicate rows from the dataset.</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="1" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''1'');
          ">
            <span>Reshape data by converting rows into columns for structured reports.</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="2" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''2'');
          ">
            <span>Sort data based on alphabetical order.</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="3" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''3'');
          ">
            <span>Fill in missing values with the mean of the column.</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-bdzpo0l'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<p class="text-slate-300 leading-relaxed mb-6">Test your knowledge of the ETL process and common data file formats.</p>
',
  1
) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, kind = EXCLUDED.kind, content_html = EXCLUDED.content_html, display_order = EXCLUDED.display_order;
INSERT INTO public.lessons (id, module_id, title, kind, content_html, display_order)
VALUES (
  '5cb7a4e2-d9f1-487b-aa58-c2b694b8e202',
  '7a2e84cf-81b4-4e9b-a01c-6d9b3a0f7e02',
  'Module 2 Assessment',
  'assessment',
  '',
  2
) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, kind = EXCLUDED.kind, content_html = EXCLUDED.content_html, display_order = EXCLUDED.display_order;
INSERT INTO public.lessons (id, module_id, title, kind, content_html, display_order)
VALUES (
  '1e92c4b7-5d03-49ef-b32f-7798ef1a4c03',
  '7a2e84cf-81b4-4e9b-a01c-6d9b3a0f7e03',
  'SQL & Databases - Textbook',
  'material',
  '<!-- KVJ_MATERIAL_METADATA: {"type":"document","blocks":[{"id":"tsax0b0","type":"heading","text":"3. Data Analysis"},{"id":"xx9w6as","type":"list","title":"","points":["Data collection: Gathering data from various sources such as databases, surveys,\r\n                    websites, or transactional systems.","Data cleaning: Identifying and correcting errors, handling missing values, and\r\n                    removing inconsistencies to ensure data quality.","Data transformation: Converting data into suitable formats, restructuring datasets\r\n                    (including operations like pivoting), and preparing it for analysis.","Data exploration and modeling: Applying statistical techniques, logical reasoning,\r\n                    or analytical tools to identify trends, relationships, and patterns.","Data interpretation and visualization: Presenting findings through charts,\r\n                    dashboards, and reports using tools like Microsoft Excel, Power BI, or programming languages such as\r\n                    Python."]},{"id":"70a9zka","type":"borderedtext","title":"Goal","text":"The ultimate goal of data analysis is to convert raw, unorganized data into\r\n                actionable insights that can guide business strategies, improve performance, and solve real-world\r\n                problems."},{"id":"p8e3wul","type":"subheading","text":"3.1 Analysis Types"},{"id":"udayzbp","type":"subheading","text":"The Four Maturity Levels of Data Analytics"},{"id":"8oerj0u","type":"list","title":"","points":["Descriptive: What happened? (Summarizing past data)","Diagnostic: Why did it happen? (Identifying root causes)","Predictive: What will happen? (Forecasting future trends)","Prescriptive: How can we make it happen? (Prescribing actions)"]},{"id":"q62lbdq","type":"subheading","text":"3.2 Descriptive Analysis"},{"id":"xloap57","type":"subheading","text":"Sheet: Course_Stats"},{"id":"wgu199j","type":"table","headers":["Course_ID","Course_Name","Enrollments"],"rows":[["101","Math","150"],["102","Science","200"],["103","History","120"],["104","Art","80"],["105","Programming","300"]]},{"id":"tq0kue4","type":"subheading","text":"Sheet: Teacher_Ratings"},{"id":"zgm70v9","type":"table","headers":["Teacher_ID","Teacher_Name","Avg_Rating"],"rows":[["1","Ms. Johnson","4.8"],["2","Mr. Smith","4.5"],["3","Dr. Adams","4.9"],["4","Prof. Clark","4.2"],["5","Ms. Lee","4.7"]]},{"id":"108tetn","type":"subheading","text":"Example: Descriptive Analysis in Python"},{"id":"t0edgwr","type":"paragraph","text":"Using pandas, we ingest the data from Excel and calculate summary statistics like averages and maximums."},{"id":"bkp0eyv","type":"subheading","text":"Visualizing Descriptive Data"},{"id":"te701wt","type":"borderedtext","title":"Insight","text":"Visualization makes it instantly obvious which course has the highest\r\n                        participation, rather than scanning through rows of raw data."},{"id":"vmbqsuu","type":"subheading","text":"3.3 Diagnostic Analysis"},{"id":"s61l92s","type":"subheading","text":"The Merged Dataset"},{"id":"m847anm","type":"paragraph","text":"To identify correlations, we merge the Course_Stats and Teacher_Ratings sheets on the common field: Teacher_ID."},{"id":"p51tbe1","type":"table","headers":["Course_Name","Enrollments","Teacher_Name","Avg_Rating"],"rows":[["Math","150","Ms. Johnson","4.8"],["Science","200","Mr. Smith","4.5"],["History","120","Dr. Adams","4.9"],["Art","80","Prof. Clark","4.2"],["Programming","300","Ms. Lee","4.7"]]},{"id":"61k17oh","type":"subheading","text":"Example: Diagnostic Analysis in Python"},{"id":"5lh61yk","type":"paragraph","text":"We use the .corr() method to find the mathematical relationship between enrollment numbers and ratings."},{"id":"xzambls","type":"subheading","text":"Visualizing Diagnostic Data"},{"id":"pk51vfk","type":"borderedtext","title":"Insight","text":"With a correlation near 0.28, there is a weak positive relationship.\r\n                        Visualizing this helps confirm that while some popular courses have high ratings, there''s no\r\n                        strict rule that higher enrollment drastically changes the rating."},{"id":"8j9gffy","type":"subheading","text":"3.4 Predictive Analysis"},{"id":"pvdegmy","type":"subheading","text":"Example: Predictive Analysis in Python"},{"id":"l40aqya","type":"paragraph","text":"Here is how you might perform basic predictive analysis using simple linear regression with Python."},{"id":"7c8vvgy","type":"subheading","text":"Visualizing Predictive Data"},{"id":"rtqaxt9","type":"borderedtext","title":"Insight","text":"The purple diamond represents our . Even though we never had a teacher with exactly a 4.6 rating, the model\r\n                        uses the trend to estimate they would attract approximately 168 students."},{"id":"ij5b2sh","type":"subheading","text":"3.5 Prescriptive Analysis"},{"id":"pj2h7w9","type":"subheading","text":"Example: Prescriptive Analysis in Python"},{"id":"scfgl9e","type":"subheading","text":"Visualizing Prescriptive Data"},{"id":"mb20mki","type":"borderedtext","title":"Actionable Recommendation","text":"The curve peaks exactly at the \r\n                        price point. Setting the price lower leaves money on the table, while setting it higher could\r\n                        drastically reduce enrollments. The prescription is clear: Set the price to $150."},{"id":"k5kmk5b","type":"heading","text":"Knowledge Check: Data Analysis Types"},{"id":"hh6idkw","type":"assessment","title":"Practice Check","questions":[{"text":"Question","options":["Predictive Analytics","Exploratory Data Analysis (EDA)","Prescriptive Analytics","Diagnostic Analytics"],"correct":"1"}]},{"id":"8zurjpk","type":"assessment","title":"Practice Check","questions":[{"text":"Question","options":["Descriptive Analytics","Diagnostic Analytics","Predictive Analytics","Prescriptive Analytics"],"correct":"1"}]},{"id":"hsu0rtp","type":"subheading","text":"Descriptive"},{"id":"g6qpg6u","type":"subheading","text":"Diagnostic"},{"id":"vdh6r4u","type":"subheading","text":"Predictive"},{"id":"3uobndn","type":"subheading","text":"Prescriptive"},{"id":"f5j6t5n","type":"heading","text":"Knowledge Check: EDA & Data Drilling"},{"id":"znjw1yt","type":"assessment","title":"Practice Check","questions":[{"text":"Question","options":["Aggregation","Disaggregation (Drill-Down)","Data Cleaning","Predictive Modeling"],"correct":"1"}]},{"id":"hv6mqqr","type":"assessment","title":"Practice Check","questions":[{"text":"Question","options":["To investigate granular details and identify the root cause of specific data errors or outliers.","To automatically delete all duplicate records.","To summarize data into higher-level categories only.","To change the underlying structure of the database."],"correct":"0"}]},{"id":"ji90azx","type":"subheading","text":"3.9 Data Mining"},{"id":"6gb3qo5","type":"subheading","text":"3.10 Correlation Analysis"},{"id":"89d4zn9","type":"borderedtext","title":"Correlation analysis","text":"measures the strength and direction of a relationship between two variables. In data mining, it helps determine whether and how strongly pairs of variables are related."},{"id":"ysuq3u6","type":"subheading","text":"Direction of Correlation"},{"id":"7q89w4z","type":"subheading","text":"Types of Correlation Coefficients"},{"id":"d348kgo","type":"subheading","text":"3.11 Pattern Recognition"},{"id":"nhjgple","type":"subheading","text":"Frequent Patterns (Association Rules)"},{"id":"hjjsuyh","type":"subheading","text":"Sequential Patterns"},{"id":"v3jjvfu","type":"subheading","text":"Temporal Patterns"},{"id":"86a3vot","type":"subheading","text":"Comparison Summary"},{"id":"5f0q7u8","type":"table","headers":["Feature [1, 2, 3, 4, 5]","Frequent Patterns","Sequential Patterns","Temporal Patterns"],"rows":[["Primary Goal","Co-occurrence","Order of events","Time & Duration"],["Order Constraint","Irrelevant","Crucial","Crucial"],["Time/Duration","None","Implicit/Ignored","Explicitly analyzed"],["Example","{Bread, Milk}","A &rarr; B &rarr; C","A &rarr; (10 min) B"]]},{"id":"cwn9fx8","type":"subheading","text":"3.12 Anomaly Detection & Outliers"},{"id":"ckboej1","type":"list","title":"","points":["Detecting fraudulent credit card transactions","Identifying network intrusions (Cybersecurity)","Spotting manufacturing defects","Monitoring abnormal behavior in healthcare data"]},{"id":"j25lodk","type":"paragraph","text":"Visual representation of a statistical outlier."},{"id":"5j3u8ga","type":"heading","text":"Knowledge Check: AI & Machine Learning"},{"id":"x8gykpz","type":"assessment","title":"Practice Check","questions":[{"text":"Question","options":["Data Warehousing","Artificial Intelligence (AI)","Traditional Programming","Manual Data Entry"],"correct":"1"}]},{"id":"rneomm4","type":"assessment","title":"Practice Check","questions":[{"text":"Question","options":["Web Development","Cloud Computing","Artificial Intelligence (AI)","Hardware Engineering"],"correct":"2"}]},{"id":"b64uaix","type":"assessment","title":"Practice Check","questions":[{"text":"Question","options":["Natural Language Processing","Data Transformation","Anomaly Detection","Regression Analysis"],"correct":"2"}]},{"id":"j64ez39","type":"assessment","title":"Practice Check","questions":[{"text":"Question","options":["Natural Language Processing (NLP)","Clustering","Data Granularity","Feature Selection"],"correct":"0"}]},{"id":"lmnyve7","type":"assessment","title":"Practice Check","questions":[{"text":"Question","options":["Regression","Clustering","Classification","Normalization"],"correct":"2"}]},{"id":"w45ad4o","type":"assessment","title":"Practice Check","questions":[{"text":"Question","options":["A Database","An Algorithm","A Spreadsheet","Hardware"],"correct":"1"}]},{"id":"srl9ovd","type":"assessment","title":"Practice Check","questions":[{"text":"Question","options":["Clustering","Data Mining","Regression","Feature Selection"],"correct":"2"}]},{"id":"veaw6sr","type":"assessment","title":"Practice Check","questions":[{"text":"Question","options":["Anomaly Detection","Predictive Modeling","Data Cleaning","Univariate Analysis"],"correct":"1"}]},{"id":"srr8ywt","type":"subheading","text":"Ready for the Module 3 Assessment?"},{"id":"e9j24sp","type":"paragraph","text":"Test your knowledge of advanced analytics, predictive modeling, and the role of AI."}]} -->
<h2 class="text-2xl font-extrabold text-white mt-12 mb-6 border-b border-white/10 pb-2">3. Data Analysis</h2>
<div class="my-6 text-left space-y-4">
  
  <ul class="space-y-3" style="list-style-type: none; padding-left: 0;">
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Data collection: Gathering data from various sources such as databases, surveys,
                    websites, or transactional systems.</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Data cleaning: Identifying and correcting errors, handling missing values, and
                    removing inconsistencies to ensure data quality.</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Data transformation: Converting data into suitable formats, restructuring datasets
                    (including operations like pivoting), and preparing it for analysis.</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Data exploration and modeling: Applying statistical techniques, logical reasoning,
                    or analytical tools to identify trends, relationships, and patterns.</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Data interpretation and visualization: Presenting findings through charts,
                    dashboards, and reports using tools like Microsoft Excel, Power BI, or programming languages such as
                    Python.</span>
    </li>
  </ul>
</div>
<div class="my-6 border-l-4 border-white bg-white/5 p-6 rounded-r-2xl text-left">
  <h4 class="text-white font-bold text-sm mb-3">Goal</h4>
  <p class="text-slate-350 text-sm leading-relaxed mb-0">The ultimate goal of data analysis is to convert raw, unorganized data into
                actionable insights that can guide business strategies, improve performance, and solve real-world
                problems.</p>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">3.1 Analysis Types</h3>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">The Four Maturity Levels of Data Analytics</h3>
<div class="my-6 text-left space-y-4">
  
  <ul class="space-y-3" style="list-style-type: none; padding-left: 0;">
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Descriptive: What happened? (Summarizing past data)</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Diagnostic: Why did it happen? (Identifying root causes)</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Predictive: What will happen? (Forecasting future trends)</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Prescriptive: How can we make it happen? (Prescribing actions)</span>
    </li>
  </ul>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">3.2 Descriptive Analysis</h3>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Sheet: Course_Stats</h3>
<div class="my-8 overflow-x-auto rounded-2xl border border-white/10 shadow-soft bg-[#0B2A22]/40">
  <table class="w-full text-sm text-left">
    <thead class="bg-white/5 border-b border-white/10">
      <tr>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Course_ID</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Course_Name</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Enrollments</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/5">
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">101</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Math</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">150</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">102</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Science</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">200</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">103</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">History</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">120</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">104</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Art</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">80</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">105</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Programming</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">300</td>
    </tr>
    </tbody>
  </table>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Sheet: Teacher_Ratings</h3>
<div class="my-8 overflow-x-auto rounded-2xl border border-white/10 shadow-soft bg-[#0B2A22]/40">
  <table class="w-full text-sm text-left">
    <thead class="bg-white/5 border-b border-white/10">
      <tr>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Teacher_ID</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Teacher_Name</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Avg_Rating</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/5">
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">1</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Ms. Johnson</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">4.8</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">2</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Mr. Smith</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">4.5</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">3</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Dr. Adams</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">4.9</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">4</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Prof. Clark</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">4.2</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">5</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Ms. Lee</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">4.7</td>
    </tr>
    </tbody>
  </table>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Example: Descriptive Analysis in Python</h3>
<p class="text-slate-300 leading-relaxed mb-6">Using pandas, we ingest the data from Excel and calculate summary statistics like averages and maximums.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Visualizing Descriptive Data</h3>
<div class="my-6 border-l-4 border-white bg-white/5 p-6 rounded-r-2xl text-left">
  <h4 class="text-white font-bold text-sm mb-3">Insight</h4>
  <p class="text-slate-350 text-sm leading-relaxed mb-0">Visualization makes it instantly obvious which course has the highest
                        participation, rather than scanning through rows of raw data.</p>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">3.3 Diagnostic Analysis</h3>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">The Merged Dataset</h3>
<p class="text-slate-300 leading-relaxed mb-6">To identify correlations, we merge the Course_Stats and Teacher_Ratings sheets on the common field: Teacher_ID.</p>
<div class="my-8 overflow-x-auto rounded-2xl border border-white/10 shadow-soft bg-[#0B2A22]/40">
  <table class="w-full text-sm text-left">
    <thead class="bg-white/5 border-b border-white/10">
      <tr>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Course_Name</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Enrollments</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Teacher_Name</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Avg_Rating</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/5">
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Math</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">150</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Ms. Johnson</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">4.8</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Science</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">200</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Mr. Smith</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">4.5</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">History</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">120</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Dr. Adams</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">4.9</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Art</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">80</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Prof. Clark</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">4.2</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Programming</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">300</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Ms. Lee</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">4.7</td>
    </tr>
    </tbody>
  </table>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Example: Diagnostic Analysis in Python</h3>
<p class="text-slate-300 leading-relaxed mb-6">We use the .corr() method to find the mathematical relationship between enrollment numbers and ratings.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Visualizing Diagnostic Data</h3>
<div class="my-6 border-l-4 border-white bg-white/5 p-6 rounded-r-2xl text-left">
  <h4 class="text-white font-bold text-sm mb-3">Insight</h4>
  <p class="text-slate-350 text-sm leading-relaxed mb-0">With a correlation near 0.28, there is a weak positive relationship.
                        Visualizing this helps confirm that while some popular courses have high ratings, there''s no
                        strict rule that higher enrollment drastically changes the rating.</p>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">3.4 Predictive Analysis</h3>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Example: Predictive Analysis in Python</h3>
<p class="text-slate-300 leading-relaxed mb-6">Here is how you might perform basic predictive analysis using simple linear regression with Python.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Visualizing Predictive Data</h3>
<div class="my-6 border-l-4 border-white bg-white/5 p-6 rounded-r-2xl text-left">
  <h4 class="text-white font-bold text-sm mb-3">Insight</h4>
  <p class="text-slate-350 text-sm leading-relaxed mb-0">The purple diamond represents our . Even though we never had a teacher with exactly a 4.6 rating, the model
                        uses the trend to estimate they would attract approximately 168 students.</p>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">3.5 Prescriptive Analysis</h3>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Example: Prescriptive Analysis in Python</h3>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Visualizing Prescriptive Data</h3>
<div class="my-6 border-l-4 border-white bg-white/5 p-6 rounded-r-2xl text-left">
  <h4 class="text-white font-bold text-sm mb-3">Actionable Recommendation</h4>
  <p class="text-slate-350 text-sm leading-relaxed mb-0">The curve peaks exactly at the 
                        price point. Setting the price lower leaves money on the table, while setting it higher could
                        drastically reduce enrollments. The prescription is clear: Set the price to $150.</p>
</div>
<h2 class="text-2xl font-extrabold text-white mt-12 mb-6 border-b border-white/10 pb-2">Knowledge Check: Data Analysis Types</h2>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-90yp056" data-questions="[{&quot;text&quot;:&quot;Question&quot;,&quot;options&quot;:[&quot;Predictive Analytics&quot;,&quot;Exploratory Data Analysis (EDA)&quot;,&quot;Prescriptive Analytics&quot;,&quot;Diagnostic Analytics&quot;],&quot;correct&quot;:&quot;1&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. Question</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>Predictive Analytics</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="1" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''1'');
          ">
            <span>Exploratory Data Analysis (EDA)</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="2" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''2'');
          ">
            <span>Prescriptive Analytics</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="3" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''3'');
          ">
            <span>Diagnostic Analytics</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-90yp056'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-7bh1r76" data-questions="[{&quot;text&quot;:&quot;Question&quot;,&quot;options&quot;:[&quot;Descriptive Analytics&quot;,&quot;Diagnostic Analytics&quot;,&quot;Predictive Analytics&quot;,&quot;Prescriptive Analytics&quot;],&quot;correct&quot;:&quot;1&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. Question</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>Descriptive Analytics</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="1" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''1'');
          ">
            <span>Diagnostic Analytics</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="2" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''2'');
          ">
            <span>Predictive Analytics</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="3" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''3'');
          ">
            <span>Prescriptive Analytics</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-7bh1r76'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Descriptive</h3>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Diagnostic</h3>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Predictive</h3>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Prescriptive</h3>
<h2 class="text-2xl font-extrabold text-white mt-12 mb-6 border-b border-white/10 pb-2">Knowledge Check: EDA & Data Drilling</h2>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-9r6ndib" data-questions="[{&quot;text&quot;:&quot;Question&quot;,&quot;options&quot;:[&quot;Aggregation&quot;,&quot;Disaggregation (Drill-Down)&quot;,&quot;Data Cleaning&quot;,&quot;Predictive Modeling&quot;],&quot;correct&quot;:&quot;1&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. Question</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>Aggregation</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="1" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''1'');
          ">
            <span>Disaggregation (Drill-Down)</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="2" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''2'');
          ">
            <span>Data Cleaning</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="3" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''3'');
          ">
            <span>Predictive Modeling</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-9r6ndib'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-8aveq83" data-questions="[{&quot;text&quot;:&quot;Question&quot;,&quot;options&quot;:[&quot;To investigate granular details and identify the root cause of specific data errors or outliers.&quot;,&quot;To automatically delete all duplicate records.&quot;,&quot;To summarize data into higher-level categories only.&quot;,&quot;To change the underlying structure of the database.&quot;],&quot;correct&quot;:&quot;0&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. Question</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>To investigate granular details and identify the root cause of specific data errors or outliers.</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="1" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''1'');
          ">
            <span>To automatically delete all duplicate records.</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="2" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''2'');
          ">
            <span>To summarize data into higher-level categories only.</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="3" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''3'');
          ">
            <span>To change the underlying structure of the database.</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-8aveq83'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">3.9 Data Mining</h3>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">3.10 Correlation Analysis</h3>
<div class="my-6 border-l-4 border-white bg-white/5 p-6 rounded-r-2xl text-left">
  <h4 class="text-white font-bold text-sm mb-3">Correlation analysis</h4>
  <p class="text-slate-350 text-sm leading-relaxed mb-0">measures the strength and direction of a relationship between two variables. In data mining, it helps determine whether and how strongly pairs of variables are related.</p>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Direction of Correlation</h3>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Types of Correlation Coefficients</h3>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">3.11 Pattern Recognition</h3>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Frequent Patterns (Association Rules)</h3>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Sequential Patterns</h3>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Temporal Patterns</h3>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Comparison Summary</h3>
<div class="my-8 overflow-x-auto rounded-2xl border border-white/10 shadow-soft bg-[#0B2A22]/40">
  <table class="w-full text-sm text-left">
    <thead class="bg-white/5 border-b border-white/10">
      <tr>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Feature [1, 2, 3, 4, 5]</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Frequent Patterns</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Sequential Patterns</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Temporal Patterns</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/5">
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Primary Goal</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Co-occurrence</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Order of events</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Time & Duration</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Order Constraint</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Irrelevant</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Crucial</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Crucial</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Time/Duration</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">None</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Implicit/Ignored</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Explicitly analyzed</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Example</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">{Bread, Milk}</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">A &rarr; B &rarr; C</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">A &rarr; (10 min) B</td>
    </tr>
    </tbody>
  </table>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">3.12 Anomaly Detection & Outliers</h3>
<div class="my-6 text-left space-y-4">
  
  <ul class="space-y-3" style="list-style-type: none; padding-left: 0;">
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Detecting fraudulent credit card transactions</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Identifying network intrusions (Cybersecurity)</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Spotting manufacturing defects</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Monitoring abnormal behavior in healthcare data</span>
    </li>
  </ul>
</div>
<p class="text-slate-300 leading-relaxed mb-6">Visual representation of a statistical outlier.</p>
<h2 class="text-2xl font-extrabold text-white mt-12 mb-6 border-b border-white/10 pb-2">Knowledge Check: AI & Machine Learning</h2>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-p1q6n1i" data-questions="[{&quot;text&quot;:&quot;Question&quot;,&quot;options&quot;:[&quot;Data Warehousing&quot;,&quot;Artificial Intelligence (AI)&quot;,&quot;Traditional Programming&quot;,&quot;Manual Data Entry&quot;],&quot;correct&quot;:&quot;1&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. Question</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>Data Warehousing</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="1" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''1'');
          ">
            <span>Artificial Intelligence (AI)</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="2" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''2'');
          ">
            <span>Traditional Programming</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="3" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''3'');
          ">
            <span>Manual Data Entry</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-p1q6n1i'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-999hwbu" data-questions="[{&quot;text&quot;:&quot;Question&quot;,&quot;options&quot;:[&quot;Web Development&quot;,&quot;Cloud Computing&quot;,&quot;Artificial Intelligence (AI)&quot;,&quot;Hardware Engineering&quot;],&quot;correct&quot;:&quot;2&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. Question</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>Web Development</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="1" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''1'');
          ">
            <span>Cloud Computing</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="2" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''2'');
          ">
            <span>Artificial Intelligence (AI)</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="3" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''3'');
          ">
            <span>Hardware Engineering</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-999hwbu'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-j2oz915" data-questions="[{&quot;text&quot;:&quot;Question&quot;,&quot;options&quot;:[&quot;Natural Language Processing&quot;,&quot;Data Transformation&quot;,&quot;Anomaly Detection&quot;,&quot;Regression Analysis&quot;],&quot;correct&quot;:&quot;2&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. Question</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>Natural Language Processing</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="1" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''1'');
          ">
            <span>Data Transformation</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="2" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''2'');
          ">
            <span>Anomaly Detection</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="3" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''3'');
          ">
            <span>Regression Analysis</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-j2oz915'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-tlfll8c" data-questions="[{&quot;text&quot;:&quot;Question&quot;,&quot;options&quot;:[&quot;Natural Language Processing (NLP)&quot;,&quot;Clustering&quot;,&quot;Data Granularity&quot;,&quot;Feature Selection&quot;],&quot;correct&quot;:&quot;0&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. Question</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>Natural Language Processing (NLP)</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="1" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''1'');
          ">
            <span>Clustering</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="2" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''2'');
          ">
            <span>Data Granularity</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="3" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''3'');
          ">
            <span>Feature Selection</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-tlfll8c'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-v7r84s5" data-questions="[{&quot;text&quot;:&quot;Question&quot;,&quot;options&quot;:[&quot;Regression&quot;,&quot;Clustering&quot;,&quot;Classification&quot;,&quot;Normalization&quot;],&quot;correct&quot;:&quot;2&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. Question</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>Regression</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="1" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''1'');
          ">
            <span>Clustering</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="2" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''2'');
          ">
            <span>Classification</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="3" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''3'');
          ">
            <span>Normalization</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-v7r84s5'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-17u5vui" data-questions="[{&quot;text&quot;:&quot;Question&quot;,&quot;options&quot;:[&quot;A Database&quot;,&quot;An Algorithm&quot;,&quot;A Spreadsheet&quot;,&quot;Hardware&quot;],&quot;correct&quot;:&quot;1&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. Question</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>A Database</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="1" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''1'');
          ">
            <span>An Algorithm</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="2" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''2'');
          ">
            <span>A Spreadsheet</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="3" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''3'');
          ">
            <span>Hardware</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-17u5vui'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-um2wcor" data-questions="[{&quot;text&quot;:&quot;Question&quot;,&quot;options&quot;:[&quot;Clustering&quot;,&quot;Data Mining&quot;,&quot;Regression&quot;,&quot;Feature Selection&quot;],&quot;correct&quot;:&quot;2&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. Question</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>Clustering</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="1" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''1'');
          ">
            <span>Data Mining</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="2" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''2'');
          ">
            <span>Regression</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="3" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''3'');
          ">
            <span>Feature Selection</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-um2wcor'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-zf9apqe" data-questions="[{&quot;text&quot;:&quot;Question&quot;,&quot;options&quot;:[&quot;Anomaly Detection&quot;,&quot;Predictive Modeling&quot;,&quot;Data Cleaning&quot;,&quot;Univariate Analysis&quot;],&quot;correct&quot;:&quot;1&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. Question</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>Anomaly Detection</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="1" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''1'');
          ">
            <span>Predictive Modeling</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="2" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''2'');
          ">
            <span>Data Cleaning</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="3" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''3'');
          ">
            <span>Univariate Analysis</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-zf9apqe'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Ready for the Module 3 Assessment?</h3>
<p class="text-slate-300 leading-relaxed mb-6">Test your knowledge of advanced analytics, predictive modeling, and the role of AI.</p>
',
  1
) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, kind = EXCLUDED.kind, content_html = EXCLUDED.content_html, display_order = EXCLUDED.display_order;
INSERT INTO public.lessons (id, module_id, title, kind, content_html, display_order)
VALUES (
  '5cb7a4e2-d9f1-487b-aa58-c2b694b8e203',
  '7a2e84cf-81b4-4e9b-a01c-6d9b3a0f7e03',
  'Module 3 Assessment',
  'assessment',
  '',
  2
) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, kind = EXCLUDED.kind, content_html = EXCLUDED.content_html, display_order = EXCLUDED.display_order;
INSERT INTO public.lessons (id, module_id, title, kind, content_html, display_order)
VALUES (
  '1e92c4b7-5d03-49ef-b32f-7798ef1a4c04',
  '7a2e84cf-81b4-4e9b-a01c-6d9b3a0f7e04',
  'Reporting & Data Visualization - Textbook',
  'material',
  '<!-- KVJ_MATERIAL_METADATA: {"type":"document","blocks":[{"id":"s4qf0nn","type":"heading","text":"4.1 Report Data"},{"id":"yksoto7","type":"paragraph","text":"Reporting data on a corporation involves gathering, analyzing, and presenting information to provide insights into the company''s performance, operations, and strategy."},{"id":"zjl9d4q","type":"paragraph","text":"Purpose:"},{"id":"k0qdtkr","type":"paragraph","text":"The main goal of reporting is to provide accurate and timely information that helps stakeholders understand performance, make informed decisions, and optimize business strategies for better outcomes."},{"id":"hwddb1j","type":"heading","text":"4.2 Types of Reports"},{"id":"n39hqxr","type":"paragraph","text":"Businesses use different types of reports to monitor various aspects of their operations. The three primary categories are:"},{"id":"oaymg75","type":"list","title":"","points":["Provide detailed information about a company''s financial performance.","Include income statements, balance sheets, and cash flow statements.","Help assess profitability and overall financial health."]},{"id":"elscn8j","type":"list","title":"","points":["Offer insights into sales activities, trends, and performance metrics.","Allow businesses to track revenue and identify top-performing products.","Help evaluate and refine sales strategies."]},{"id":"z4kuwt1","type":"list","title":"","points":["Highlight key performance indicators (KPIs) and operational efficiency metrics.","Track employee performance and progress toward business goals.","Provide the basis for making data-driven decisions."]},{"id":"dyb1172","type":"heading","text":"4.3 Case Study: Types of Reports at Apple Inc."},{"id":"ulqqi1h","type":"paragraph","text":"To understand how these reports function in the real world, let''s look at how Apple Inc. utilizes different reporting structures to maintain its position as a global leader."},{"id":"e4qnm4d","type":"subheading","text":"4.3.1 Financial Reports"},{"id":"um09bai","type":"paragraph","text":"Apple''s financial reports, such as quarterly earnings reports and annual financial statements, provide a comprehensive view of the company''s revenue, expenses, and overall financial health. These reports help investors and stakeholders understand the company''s profitability and growth."},{"id":"f3n381z","type":"subheading","text":"4.3.2 Sales Reports"},{"id":"rnog3rx","type":"paragraph","text":"Apple''s sales reports detail the performance of its products, like the iPhone, iPad, and Mac. These reports help the company track which products are selling well, identify trends in consumer preferences, and adjust marketing and production strategies accordingly."},{"id":"43p9u8n","type":"subheading","text":"4.3.3 Performance Reports"},{"id":"m7s9x7n","type":"paragraph","text":"Apple''s performance reports assess the company''s key performance indicators (KPIs), such as innovation rate, supply chain efficiency, and customer satisfaction. These reports are crucial for measuring progress towards strategic goals and ensuring that Apple maintains its competitive edge in the tech industry."},{"id":"ysqjgdr","type":"heading","text":"4.4 Importance and Audience of Reporting"},{"id":"p7ntbov","type":"subheading","text":"4.4.1 Importance of Reporting"},{"id":"ghckjxk","type":"subheading","text":"4.4.2 Who Uses Reports?"},{"id":"uo1lfnx","type":"heading","text":"4.5 Practical Case Study: BANAVIL AvilMilk Shop"},{"id":"evl8n4p","type":"subheading","text":"4.5.1 BANAVIL AvilMilk Shop"},{"id":"bvs3h9u","type":"subheading","text":"4.5.2 One Day Sales Report"},{"id":"fefloz1","type":"paragraph","text":"This report presents the real-world sales data from BANAVIL Avilmilk shop, derived from actual bills collected on 22-Aug-2024."},{"id":"ldp8f4m","type":"borderedtext","title":"Context","text":"As a data analyst, your task is to visualize the sales performance of various product categories based on this day''s activity."},{"id":"t29hssa","type":"subheading","text":"4.5.2 Bills of the Day"},{"id":"oscpyie","type":"paragraph","text":"We have to report the data of BANAVIL Avilmilk shop’s one day sales ."},{"id":"izxewum","type":"subheading","text":"4.5.3 Data Tables: Structured Analysis"},{"id":"dy7ejyb","type":"paragraph","text":"The Power of Tabular Data"},{"id":"9hbgg10","type":"list","title":"","points":["Clear Organization: Tables neatly arrange data, making it easy to see and understand.","Easy Comparison: They help quickly compare different data points side by side.","Quick Summary: Tables summarize data effectively, highlighting important totals.","Precise Information: They present numbers clearly and accurately."]},{"id":"w5uv863","type":"borderedtext","title":"Activity","text":"Complete the Sales Data Table below by dragging the missing values into their correct positions.\r\n                        \r\n                            3.00\r\n                            80.00\r\n                            80.00\r\n                            ₹ 2085.00\r\n                        \r\n                        \r\n                            Verify Table"},{"id":"n5z7uoo","type":"table","headers":["Order ID","Items Purchased","Qty","Price","Total"],"rows":[["#011","Vanilla","Drop here","50.00","150.00"],["#012","Nut & Fruit","1.00","90.00","90.00"],["#012","Lychee","1.00","Drop here","80.00"],["#013","Nuts Special","1.00","120.00","120.00"],["#013","Parcel Charge","1.00","5.00","5.00"],["#014","Normal","2.00","40.00","Drop here"],["#015","Vanilla","2.00","50.00","100.00"],["#016","Vanilla","2.00","50.00","100.00"],["#017","Dry Fruits","3.00","150.00","450.00"],["#017","Parcel Charge","3.00","5.00","5.00"],["#018","Vanilla","3.00","50.00","150.00"],["#019","Vanilla","1.00","50.00","50.00"],["#019","Normal","1.00","40.00","40.00"],["#0110","Fruit","2.00","60.00","120.00"],["#0111","Normal","2.00","40.00","80.00"],["#0112","Nut & Fruit","3.00","90.00","270.00"],["#0113","Nut & Fruit","1.00","90.00","90.00"],["#0113","Parcel Charge","1.00","5.00","5.00"],["#0114","Vanilla","2.00","50.00","100.00"],["GRAND TOTAL","35.00","","Drop here"]]},{"id":"ukf114h","type":"subheading","text":"4.5.4 Live Insights Lab: Banavil Report Builder"},{"id":"rne6xvh","type":"paragraph","text":"Practice creating your own reports by selecting the fields below. What story does the data tell?"},{"id":"pruv7ij","type":"paragraph","text":"Insight: Vanilla is the top contributor to volume today."},{"id":"4ynfegs","type":"table","headers":["Items Purchased","Quantity","Amount (₹)"],"rows":[["Vanilla","13","650"],["Nut & Fruit","5","450"],["Dry Fruits","3","450"],["Normal","5","200"],["Nuts Special","1","120"],["Fruit","2","120"],["Lychee","1","80"],["Parcel Charge","3","15"],["TOTAL","33","₹ 2085"]]},{"id":"zpmw660","type":"paragraph","text":"Key Takeaways"},{"id":"nze3pv5","type":"list","title":"","points":["Top Seller: Vanilla is the most popular item, with 13 units sold.","High Revenue Items: \"Nut & Fruit\" and \"Dry Fruits\" each brought in ₹450.","Low Sales: \"Lychee\" had the lowest sales during this period.","Overall Sales: Total revenue from all items is ₹2,085, with 33 total items sold."]},{"id":"jq4yssx","type":"borderedtext","title":"Critical Thinking","text":"While Vanilla sold the most units, Nut & Fruit and Dry Fruits are \"High Value\" items because they generate significant revenue from fewer sales."},{"id":"gd7kqad","type":"heading","text":"4.6 The Visualization Library: Choosing the Right Chart"},{"id":"feeyisa","type":"paragraph","text":"Selecting the correct chart type is crucial for effective communication. Click on any chart category below to see detailed usage guidelines, interactive demonstrations, and insights."},{"id":"fu6t56i","type":"subheading","text":"4.6.1 Column Chart"},{"id":"pvle9lx","type":"paragraph","text":"Vertical bars representing data magnitude."},{"id":"6cob8ns","type":"subheading","text":"4.6.2 Bar Chart"},{"id":"8pwpzee","type":"paragraph","text":"Horizontal bars for categorical comparison."},{"id":"ohe5pe7","type":"subheading","text":"4.6.3 Line Chart"},{"id":"2lckybq","type":"paragraph","text":"Connecting points to show trends over time."},{"id":"343q74l","type":"subheading","text":"4.6.4 Scatter Plot"},{"id":"pov1u5i","type":"paragraph","text":"Analyzing relationships between variables."},{"id":"xply126","type":"subheading","text":"4.6.5 Pie Chart"},{"id":"j5jdhbd","type":"paragraph","text":"Showing proportional parts of a whole."},{"id":"zij8zp3","type":"subheading","text":"4.6.6 Donut Chart"},{"id":"h70snjg","type":"paragraph","text":"Cleaner version of the pie chart with a hole."},{"id":"9humg38","type":"subheading","text":"4.6.7 Tree Map"},{"id":"cth0831","type":"paragraph","text":"Hierarchical nested rectangles."},{"id":"k239m8m","type":"subheading","text":"4.6.8 Area Chart"},{"id":"chz2908","type":"paragraph","text":"Trend visualization with volume emphasis."},{"id":"k2gci1h","type":"subheading","text":"4.6.9 Ribbon Chart"},{"id":"wg74fc0","type":"paragraph","text":"Tracking ranking changes over time."},{"id":"s9qbz16","type":"subheading","text":"4.6.10 Funnel Chart"},{"id":"wg05v26","type":"paragraph","text":"Visualizing stages in a process/pipeline."},{"id":"knhtxpa","type":"subheading","text":"4.6.11 Waterfall Chart"},{"id":"b76idyd","type":"paragraph","text":"Showing cumulative positive/negative effects."},{"id":"30d75pz","type":"subheading","text":"4.6.12 Sankey Diagram"},{"id":"uzbj77x","type":"paragraph","text":"Representing flow between stages."},{"id":"bomc5it","type":"heading","text":"4.7 Live Analytics Dashboard"},{"id":"9v09hc1","type":"paragraph","text":"Build your own insights! Drag a Dimension to the X-Axis and a Measure to the Y-Axis to instantly generate an aggregated chart. Then, test your skills with the challenges below."},{"id":"c6z5ptx","type":"subheading","text":"4.7.1 Analytics Challenges"},{"id":"gucq067","type":"paragraph","text":"Use the live dashboard above to answer the following business questions. Drag the correct fields to find the answer."},{"id":"0s2v2nb","type":"borderedtext","title":"Concept Highlight","text":"Ready for the Module 4 Assessment?\r\n                Test your knowledge of data visualization principles and chart selection.\r\n                \r\n                    \r\n                        START ASSESSMENT"},{"id":"m4-inline-0","type":"assessment","title":"Practice Check","questions":[{"text":"Which chart type is best suited for showing trends over continuous time?","options":["Column Chart","Line Chart","Pie Chart","Scatter Plot"],"correct":"1"}]},{"id":"m4-inline-1","type":"assessment","title":"Practice Check","questions":[{"text":"What is the primary purpose of a Scatter Plot?","options":["Show part-to-whole relationships","Show correlation or relationship between two numerical variables","Show rankings of categories","Show chronological trends"],"correct":"1"}]},{"id":"m4-inline-2","type":"assessment","title":"Practice Check","questions":[{"text":"Under which condition is a horizontal Bar Chart preferred over a vertical Column Chart?","options":["When category labels are long and need horizontal reading space","When there are very few categories","When showing cumulative totals","When values are negative"],"correct":"0"}]},{"id":"m4-inline-3","type":"assessment","title":"Practice Check","questions":[{"text":"What type of chart is ideal for showing step-by-step conversion rates and drop-offs in a business process?","options":["Waterfall Chart","Sankey Diagram","Funnel Chart","Area Chart"],"correct":"2"}]},{"id":"m4-inline-4","type":"assessment","title":"Practice Check","questions":[{"text":"Which chart shows how positive and negative incremental values lead to a final total?","options":["Area Chart","Waterfall Chart","Ribbon Chart","Donut Chart"],"correct":"1"}]},{"id":"m4-inline-5","type":"assessment","title":"Practice Check","questions":[{"text":"A Donut Chart is a variation of which chart type?","options":["Pie Chart","Bar Chart","Treemap","Sankey Diagram"],"correct":"0"}]},{"id":"m4-inline-6","type":"assessment","title":"Practice Check","questions":[{"text":"What does the width of the lines in a Sankey Diagram represent?","options":["The data category","The rate of change over time","The proportional quantity or flow volume","The specific time period"],"correct":"2"}]},{"id":"m4-inline-7","type":"assessment","title":"Practice Check","questions":[{"text":"Which chart displays hierarchical data as a set of nested rectangles?","options":["Funnel Chart","Treemap","Area Chart","Column Chart"],"correct":"1"}]}]} -->
<h2 class="text-2xl font-extrabold text-white mt-12 mb-6 border-b border-white/10 pb-2">4.1 Report Data</h2>
<p class="text-slate-300 leading-relaxed mb-6">Reporting data on a corporation involves gathering, analyzing, and presenting information to provide insights into the company''s performance, operations, and strategy.</p>
<p class="text-slate-300 leading-relaxed mb-6">Purpose:</p>
<p class="text-slate-300 leading-relaxed mb-6">The main goal of reporting is to provide accurate and timely information that helps stakeholders understand performance, make informed decisions, and optimize business strategies for better outcomes.</p>
<h2 class="text-2xl font-extrabold text-white mt-12 mb-6 border-b border-white/10 pb-2">4.2 Types of Reports</h2>
<p class="text-slate-300 leading-relaxed mb-6">Businesses use different types of reports to monitor various aspects of their operations. The three primary categories are:</p>
<div class="my-6 text-left space-y-4">
  
  <ul class="space-y-3" style="list-style-type: none; padding-left: 0;">
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Provide detailed information about a company''s financial performance.</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Include income statements, balance sheets, and cash flow statements.</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Help assess profitability and overall financial health.</span>
    </li>
  </ul>
</div>
<div class="my-6 text-left space-y-4">
  
  <ul class="space-y-3" style="list-style-type: none; padding-left: 0;">
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Offer insights into sales activities, trends, and performance metrics.</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Allow businesses to track revenue and identify top-performing products.</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Help evaluate and refine sales strategies.</span>
    </li>
  </ul>
</div>
<div class="my-6 text-left space-y-4">
  
  <ul class="space-y-3" style="list-style-type: none; padding-left: 0;">
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Highlight key performance indicators (KPIs) and operational efficiency metrics.</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Track employee performance and progress toward business goals.</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Provide the basis for making data-driven decisions.</span>
    </li>
  </ul>
</div>
<h2 class="text-2xl font-extrabold text-white mt-12 mb-6 border-b border-white/10 pb-2">4.3 Case Study: Types of Reports at Apple Inc.</h2>
<p class="text-slate-300 leading-relaxed mb-6">To understand how these reports function in the real world, let''s look at how Apple Inc. utilizes different reporting structures to maintain its position as a global leader.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">4.3.1 Financial Reports</h3>
<p class="text-slate-300 leading-relaxed mb-6">Apple''s financial reports, such as quarterly earnings reports and annual financial statements, provide a comprehensive view of the company''s revenue, expenses, and overall financial health. These reports help investors and stakeholders understand the company''s profitability and growth.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">4.3.2 Sales Reports</h3>
<p class="text-slate-300 leading-relaxed mb-6">Apple''s sales reports detail the performance of its products, like the iPhone, iPad, and Mac. These reports help the company track which products are selling well, identify trends in consumer preferences, and adjust marketing and production strategies accordingly.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">4.3.3 Performance Reports</h3>
<p class="text-slate-300 leading-relaxed mb-6">Apple''s performance reports assess the company''s key performance indicators (KPIs), such as innovation rate, supply chain efficiency, and customer satisfaction. These reports are crucial for measuring progress towards strategic goals and ensuring that Apple maintains its competitive edge in the tech industry.</p>
<h2 class="text-2xl font-extrabold text-white mt-12 mb-6 border-b border-white/10 pb-2">4.4 Importance and Audience of Reporting</h2>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">4.4.1 Importance of Reporting</h3>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">4.4.2 Who Uses Reports?</h3>
<h2 class="text-2xl font-extrabold text-white mt-12 mb-6 border-b border-white/10 pb-2">4.5 Practical Case Study: BANAVIL AvilMilk Shop</h2>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">4.5.1 BANAVIL AvilMilk Shop</h3>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">4.5.2 One Day Sales Report</h3>
<p class="text-slate-300 leading-relaxed mb-6">This report presents the real-world sales data from BANAVIL Avilmilk shop, derived from actual bills collected on 22-Aug-2024.</p>
<div class="my-6 border-l-4 border-white bg-white/5 p-6 rounded-r-2xl text-left">
  <h4 class="text-white font-bold text-sm mb-3">Context</h4>
  <p class="text-slate-350 text-sm leading-relaxed mb-0">As a data analyst, your task is to visualize the sales performance of various product categories based on this day''s activity.</p>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">4.5.2 Bills of the Day</h3>
<p class="text-slate-300 leading-relaxed mb-6">We have to report the data of BANAVIL Avilmilk shop’s one day sales .</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">4.5.3 Data Tables: Structured Analysis</h3>
<p class="text-slate-300 leading-relaxed mb-6">The Power of Tabular Data</p>
<div class="my-6 text-left space-y-4">
  
  <ul class="space-y-3" style="list-style-type: none; padding-left: 0;">
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Clear Organization: Tables neatly arrange data, making it easy to see and understand.</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Easy Comparison: They help quickly compare different data points side by side.</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Quick Summary: Tables summarize data effectively, highlighting important totals.</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Precise Information: They present numbers clearly and accurately.</span>
    </li>
  </ul>
</div>
<div class="my-6 border-l-4 border-white bg-white/5 p-6 rounded-r-2xl text-left">
  <h4 class="text-white font-bold text-sm mb-3">Activity</h4>
  <p class="text-slate-350 text-sm leading-relaxed mb-0">Complete the Sales Data Table below by dragging the missing values into their correct positions.
                        
                            3.00
                            80.00
                            80.00
                            ₹ 2085.00
                        
                        
                            Verify Table</p>
</div>
<div class="my-8 overflow-x-auto rounded-2xl border border-white/10 shadow-soft bg-[#0B2A22]/40">
  <table class="w-full text-sm text-left">
    <thead class="bg-white/5 border-b border-white/10">
      <tr>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Order ID</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Items Purchased</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Qty</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Price</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Total</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/5">
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">#011</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Vanilla</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Drop here</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">50.00</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">150.00</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">#012</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Nut & Fruit</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">1.00</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">90.00</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">90.00</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">#012</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Lychee</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">1.00</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Drop here</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">80.00</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">#013</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Nuts Special</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">1.00</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">120.00</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">120.00</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">#013</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Parcel Charge</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">1.00</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">5.00</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">5.00</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">#014</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Normal</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">2.00</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">40.00</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Drop here</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">#015</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Vanilla</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">2.00</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">50.00</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">100.00</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">#016</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Vanilla</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">2.00</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">50.00</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">100.00</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">#017</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Dry Fruits</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">3.00</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">150.00</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">450.00</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">#017</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Parcel Charge</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">3.00</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">5.00</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">5.00</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">#018</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Vanilla</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">3.00</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">50.00</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">150.00</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">#019</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Vanilla</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">1.00</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">50.00</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">50.00</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">#019</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Normal</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">1.00</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">40.00</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">40.00</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">#0110</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Fruit</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">2.00</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">60.00</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">120.00</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">#0111</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Normal</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">2.00</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">40.00</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">80.00</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">#0112</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Nut & Fruit</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">3.00</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">90.00</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">270.00</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">#0113</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Nut & Fruit</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">1.00</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">90.00</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">90.00</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">#0113</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Parcel Charge</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">1.00</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">5.00</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">5.00</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">#0114</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Vanilla</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">2.00</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">50.00</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">100.00</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">GRAND TOTAL</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">35.00</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0"></td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Drop here</td>
    </tr>
    </tbody>
  </table>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">4.5.4 Live Insights Lab: Banavil Report Builder</h3>
<p class="text-slate-300 leading-relaxed mb-6">Practice creating your own reports by selecting the fields below. What story does the data tell?</p>
<p class="text-slate-300 leading-relaxed mb-6">Insight: Vanilla is the top contributor to volume today.</p>
<div class="my-8 overflow-x-auto rounded-2xl border border-white/10 shadow-soft bg-[#0B2A22]/40">
  <table class="w-full text-sm text-left">
    <thead class="bg-white/5 border-b border-white/10">
      <tr>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Items Purchased</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Quantity</th>
      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-emerald-400 border-r border-white/10 last:border-r-0">Amount (₹)</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/5">
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Vanilla</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">13</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">650</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Nut & Fruit</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">5</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">450</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Dry Fruits</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">3</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">450</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Normal</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">5</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">200</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Nuts Special</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">1</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">120</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Fruit</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">2</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">120</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Lychee</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">1</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">80</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">Parcel Charge</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">3</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">15</td>
    </tr>
    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">TOTAL</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">33</td>
      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">₹ 2085</td>
    </tr>
    </tbody>
  </table>
</div>
<p class="text-slate-300 leading-relaxed mb-6">Key Takeaways</p>
<div class="my-6 text-left space-y-4">
  
  <ul class="space-y-3" style="list-style-type: none; padding-left: 0;">
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Top Seller: Vanilla is the most popular item, with 13 units sold.</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>High Revenue Items: "Nut & Fruit" and "Dry Fruits" each brought in ₹450.</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Low Sales: "Lychee" had the lowest sales during this period.</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Overall Sales: Total revenue from all items is ₹2,085, with 33 total items sold.</span>
    </li>
  </ul>
</div>
<div class="my-6 border-l-4 border-white bg-white/5 p-6 rounded-r-2xl text-left">
  <h4 class="text-white font-bold text-sm mb-3">Critical Thinking</h4>
  <p class="text-slate-350 text-sm leading-relaxed mb-0">While Vanilla sold the most units, Nut & Fruit and Dry Fruits are "High Value" items because they generate significant revenue from fewer sales.</p>
</div>
<h2 class="text-2xl font-extrabold text-white mt-12 mb-6 border-b border-white/10 pb-2">4.6 The Visualization Library: Choosing the Right Chart</h2>
<p class="text-slate-300 leading-relaxed mb-6">Selecting the correct chart type is crucial for effective communication. Click on any chart category below to see detailed usage guidelines, interactive demonstrations, and insights.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">4.6.1 Column Chart</h3>
<p class="text-slate-300 leading-relaxed mb-6">Vertical bars representing data magnitude.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">4.6.2 Bar Chart</h3>
<p class="text-slate-300 leading-relaxed mb-6">Horizontal bars for categorical comparison.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">4.6.3 Line Chart</h3>
<p class="text-slate-300 leading-relaxed mb-6">Connecting points to show trends over time.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">4.6.4 Scatter Plot</h3>
<p class="text-slate-300 leading-relaxed mb-6">Analyzing relationships between variables.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">4.6.5 Pie Chart</h3>
<p class="text-slate-300 leading-relaxed mb-6">Showing proportional parts of a whole.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">4.6.6 Donut Chart</h3>
<p class="text-slate-300 leading-relaxed mb-6">Cleaner version of the pie chart with a hole.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">4.6.7 Tree Map</h3>
<p class="text-slate-300 leading-relaxed mb-6">Hierarchical nested rectangles.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">4.6.8 Area Chart</h3>
<p class="text-slate-300 leading-relaxed mb-6">Trend visualization with volume emphasis.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">4.6.9 Ribbon Chart</h3>
<p class="text-slate-300 leading-relaxed mb-6">Tracking ranking changes over time.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">4.6.10 Funnel Chart</h3>
<p class="text-slate-300 leading-relaxed mb-6">Visualizing stages in a process/pipeline.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">4.6.11 Waterfall Chart</h3>
<p class="text-slate-300 leading-relaxed mb-6">Showing cumulative positive/negative effects.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">4.6.12 Sankey Diagram</h3>
<p class="text-slate-300 leading-relaxed mb-6">Representing flow between stages.</p>
<h2 class="text-2xl font-extrabold text-white mt-12 mb-6 border-b border-white/10 pb-2">4.7 Live Analytics Dashboard</h2>
<p class="text-slate-300 leading-relaxed mb-6">Build your own insights! Drag a Dimension to the X-Axis and a Measure to the Y-Axis to instantly generate an aggregated chart. Then, test your skills with the challenges below.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">4.7.1 Analytics Challenges</h3>
<p class="text-slate-300 leading-relaxed mb-6">Use the live dashboard above to answer the following business questions. Drag the correct fields to find the answer.</p>
<div class="my-6 border-l-4 border-white bg-white/5 p-6 rounded-r-2xl text-left">
  <h4 class="text-white font-bold text-sm mb-3">Concept Highlight</h4>
  <p class="text-slate-350 text-sm leading-relaxed mb-0">Ready for the Module 4 Assessment?
                Test your knowledge of data visualization principles and chart selection.
                
                    
                        START ASSESSMENT</p>
</div>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-7g56dcx" data-questions="[{&quot;text&quot;:&quot;Which chart type is best suited for showing trends over continuous time?&quot;,&quot;options&quot;:[&quot;Column Chart&quot;,&quot;Line Chart&quot;,&quot;Pie Chart&quot;,&quot;Scatter Plot&quot;],&quot;correct&quot;:&quot;1&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. Which chart type is best suited for showing trends over continuous time?</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>Column Chart</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="1" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''1'');
          ">
            <span>Line Chart</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="2" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''2'');
          ">
            <span>Pie Chart</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="3" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''3'');
          ">
            <span>Scatter Plot</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-7g56dcx'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-rxz69ti" data-questions="[{&quot;text&quot;:&quot;What is the primary purpose of a Scatter Plot?&quot;,&quot;options&quot;:[&quot;Show part-to-whole relationships&quot;,&quot;Show correlation or relationship between two numerical variables&quot;,&quot;Show rankings of categories&quot;,&quot;Show chronological trends&quot;],&quot;correct&quot;:&quot;1&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. What is the primary purpose of a Scatter Plot?</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>Show part-to-whole relationships</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="1" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''1'');
          ">
            <span>Show correlation or relationship between two numerical variables</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="2" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''2'');
          ">
            <span>Show rankings of categories</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="3" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''3'');
          ">
            <span>Show chronological trends</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-rxz69ti'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-oqbivnm" data-questions="[{&quot;text&quot;:&quot;Under which condition is a horizontal Bar Chart preferred over a vertical Column Chart?&quot;,&quot;options&quot;:[&quot;When category labels are long and need horizontal reading space&quot;,&quot;When there are very few categories&quot;,&quot;When showing cumulative totals&quot;,&quot;When values are negative&quot;],&quot;correct&quot;:&quot;0&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. Under which condition is a horizontal Bar Chart preferred over a vertical Column Chart?</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>When category labels are long and need horizontal reading space</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="1" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''1'');
          ">
            <span>When there are very few categories</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="2" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''2'');
          ">
            <span>When showing cumulative totals</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="3" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''3'');
          ">
            <span>When values are negative</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-oqbivnm'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-f73bpdb" data-questions="[{&quot;text&quot;:&quot;What type of chart is ideal for showing step-by-step conversion rates and drop-offs in a business process?&quot;,&quot;options&quot;:[&quot;Waterfall Chart&quot;,&quot;Sankey Diagram&quot;,&quot;Funnel Chart&quot;,&quot;Area Chart&quot;],&quot;correct&quot;:&quot;2&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. What type of chart is ideal for showing step-by-step conversion rates and drop-offs in a business process?</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>Waterfall Chart</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="1" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''1'');
          ">
            <span>Sankey Diagram</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="2" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''2'');
          ">
            <span>Funnel Chart</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="3" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''3'');
          ">
            <span>Area Chart</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-f73bpdb'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-4v4hylp" data-questions="[{&quot;text&quot;:&quot;Which chart shows how positive and negative incremental values lead to a final total?&quot;,&quot;options&quot;:[&quot;Area Chart&quot;,&quot;Waterfall Chart&quot;,&quot;Ribbon Chart&quot;,&quot;Donut Chart&quot;],&quot;correct&quot;:&quot;1&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. Which chart shows how positive and negative incremental values lead to a final total?</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>Area Chart</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="1" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''1'');
          ">
            <span>Waterfall Chart</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="2" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''2'');
          ">
            <span>Ribbon Chart</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="3" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''3'');
          ">
            <span>Donut Chart</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-4v4hylp'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-3qwwo8u" data-questions="[{&quot;text&quot;:&quot;A Donut Chart is a variation of which chart type?&quot;,&quot;options&quot;:[&quot;Pie Chart&quot;,&quot;Bar Chart&quot;,&quot;Treemap&quot;,&quot;Sankey Diagram&quot;],&quot;correct&quot;:&quot;0&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. A Donut Chart is a variation of which chart type?</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>Pie Chart</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="1" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''1'');
          ">
            <span>Bar Chart</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="2" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''2'');
          ">
            <span>Treemap</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="3" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''3'');
          ">
            <span>Sankey Diagram</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-3qwwo8u'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-fha6nvz" data-questions="[{&quot;text&quot;:&quot;What does the width of the lines in a Sankey Diagram represent?&quot;,&quot;options&quot;:[&quot;The data category&quot;,&quot;The rate of change over time&quot;,&quot;The proportional quantity or flow volume&quot;,&quot;The specific time period&quot;],&quot;correct&quot;:&quot;2&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. What does the width of the lines in a Sankey Diagram represent?</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>The data category</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="1" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''1'');
          ">
            <span>The rate of change over time</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="2" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''2'');
          ">
            <span>The proportional quantity or flow volume</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="3" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''3'');
          ">
            <span>The specific time period</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-fha6nvz'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-h4i465b" data-questions="[{&quot;text&quot;:&quot;Which chart displays hierarchical data as a set of nested rectangles?&quot;,&quot;options&quot;:[&quot;Funnel Chart&quot;,&quot;Treemap&quot;,&quot;Area Chart&quot;,&quot;Column Chart&quot;],&quot;correct&quot;:&quot;1&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. Which chart displays hierarchical data as a set of nested rectangles?</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>Funnel Chart</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="1" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''1'');
          ">
            <span>Treemap</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="2" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''2'');
          ">
            <span>Area Chart</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="3" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''3'');
          ">
            <span>Column Chart</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-h4i465b'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
',
  1
) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, kind = EXCLUDED.kind, content_html = EXCLUDED.content_html, display_order = EXCLUDED.display_order;
INSERT INTO public.lessons (id, module_id, title, kind, content_html, display_order)
VALUES (
  '5cb7a4e2-d9f1-487b-aa58-c2b694b8e204',
  '7a2e84cf-81b4-4e9b-a01c-6d9b3a0f7e04',
  'Module 4 Assessment',
  'assessment',
  '',
  2
) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, kind = EXCLUDED.kind, content_html = EXCLUDED.content_html, display_order = EXCLUDED.display_order;
INSERT INTO public.lessons (id, module_id, title, kind, content_html, display_order)
VALUES (
  '1e92c4b7-5d03-49ef-b32f-7798ef1a4c05',
  '7a2e84cf-81b4-4e9b-a01c-6d9b3a0f7e05',
  'Data Governance, Compliance & Privacy - Textbook',
  'material',
  '<!-- KVJ_MATERIAL_METADATA: {"type":"document","blocks":[{"id":"xcolli9","type":"heading","text":"5.1 Responsible Data Analytics"},{"id":"4fq0nx0","type":"paragraph","text":"Responsible analytics is the practice of handling data ethically, securely, and legally. As data becomes the world''s most valuable resource, the responsibility to protect it grows exponentially."},{"id":"m16vprx","type":"paragraph","text":"It ensures that data is not just \"processed\" but handled with respect for individuals'' rights and business integrity."},{"id":"qk29cqv","type":"borderedtext","title":"Golden Rule","text":"Just because you can technically extract certain insights from data doesn''t mean you should if it violates trust or ethics."},{"id":"3b242pf","type":"heading","text":"5.2 Data Privacy Laws"},{"id":"y7ltcbk","type":"paragraph","text":"Data privacy laws are regulations designed to safeguard individuals'' personal data from misuse, unauthorized access, and breaches. These laws outline how organizations must collect, store, use, and share personal information to ensure that individuals'' privacy is respected and their data is protected."},{"id":"p7uoi2d","type":"paragraph","text":"Data privacy laws vary by region, but they generally aim to achieve four key objectives:"},{"id":"ecv153h","type":"subheading","text":"Grant Individual Rights"},{"id":"an7090w","type":"paragraph","text":"Provide individuals with rights regarding their personal data, including access, correction, and deletion."},{"id":"2d3q1np","type":"subheading","text":"Protect Personal Information"},{"id":"zbkjm6n","type":"paragraph","text":"Ensure that personal data, such as names, addresses, and financial information, is handled securely and confidentially."},{"id":"lyvry6a","type":"subheading","text":"Regulate Data Processing"},{"id":"it1rn04","type":"paragraph","text":"Set guidelines for how organizations collect, use, and share personal data to prevent abuse and unauthorized use."},{"id":"0qm5bre","type":"subheading","text":"Enforce Accountability"},{"id":"8lgwibb","type":"paragraph","text":"Hold organizations accountable for data protection through audits, impact assessments, and significant penalties."},{"id":"7m5nr5w","type":"subheading","text":"5.2.1 General Data Protection Regulation (GDPR)"},{"id":"fis39ig","type":"paragraph","text":"GDPR is considered one of the most comprehensive data protection regulations globally. It sets a high standard for consent, data protection, and data subject rights. It applies to all organizations processing the personal data of EU citizens, regardless of the organization''s location."},{"id":"rwcmt84","type":"subheading","text":"Explicit Consent"},{"id":"v6wua91","type":"paragraph","text":"Requires clear, affirmative consent from individuals before any personal data is collected or processed."},{"id":"ol3gwub","type":"subheading","text":"Data Subject Rights"},{"id":"ty5f3ee","type":"paragraph","text":"Provides rights such as access, correction, erasure (right to be forgotten), and data portability."},{"id":"8t0a8e5","type":"subheading","text":"Data Protection Officer (DPO)"},{"id":"ki1lptj","type":"paragraph","text":"Organizations must appoint a DPO if they process large amounts of sensitive personal data."},{"id":"efwgb8z","type":"subheading","text":"Breach Notification"},{"id":"jefp0t8","type":"paragraph","text":"Mandatory reporting of data breaches to authorities and individuals within 72 hours of discovery."},{"id":"eri5tkb","type":"subheading","text":"Severe Financial Penalties"},{"id":"2n0ookj","type":"paragraph","text":"Non-compliance can result in significant fines (up to €20 million or 4% of global turnover, whichever is higher)."},{"id":"qq8qove","type":"subheading","text":"5.2.2 California Consumer Privacy Act (CCPA)"},{"id":"78jjkfn","type":"paragraph","text":"CCPA is a pioneering state-level privacy law in the United States that provides significant privacy rights to California residents. It has set a precedent for other states considering similar legislation."},{"id":"ns5manu","type":"subheading","text":"Consumer Rights"},{"id":"5bzr9ft","type":"paragraph","text":"Grants rights to know what personal data is being collected, to access it, and to request deletion."},{"id":"s28akea","type":"subheading","text":"Opt-Out Rights"},{"id":"aw5ccn8","type":"paragraph","text":"Provides the explicit right to opt out of the sale of personal information to third parties."},{"id":"c05agf8","type":"subheading","text":"Data Protection"},{"id":"jan0or1","type":"paragraph","text":"Requires businesses to implement and maintain reasonable security measures to protect data."},{"id":"sqfansk","type":"subheading","text":"Enforcement"},{"id":"3bj8sia","type":"paragraph","text":"Violations can result in significant fines, penalties, and the possibility of private lawsuits."},{"id":"x9rgnaq","type":"subheading","text":"5.2.3 Health Insurance Portability and Accountability Act (HIPAA)"},{"id":"pt7zj2k","type":"paragraph","text":"HIPAA is a key regulation for protecting the privacy and security of health information in the U.S. It is essential for maintaining trust in the healthcare system."},{"id":"amwoiq9","type":"subheading","text":"Protected Health Information (PHI)"},{"id":"unish8q","type":"paragraph","text":"Regulates the protection of all individually identifiable health information used in healthcare."},{"id":"dgzrw13","type":"subheading","text":"Security Rule"},{"id":"noddrst","type":"paragraph","text":"Requires administrative, physical, and technical safeguards for electronic health information."},{"id":"7d0njcn","type":"subheading","text":"Privacy Rule"},{"id":"swc0y6j","type":"paragraph","text":"Governs the use and disclosure of health information to ensure patient confidentiality."},{"id":"u2s9kmc","type":"subheading","text":"Breach Notification Rule"},{"id":"tmqs1pv","type":"paragraph","text":"Mandates notifications to individuals and the HHS in case of any data breaches."},{"id":"tdlvax9","type":"subheading","text":"5.2.4 Family Educational Rights and Privacy Act (FERPA)"},{"id":"8s9kcam","type":"paragraph","text":"FERPA is important because it protects the privacy of student education records. It gives parents and eligible students the right to access and review these records and request corrections if they believe the records are inaccurate or misleading."},{"id":"mmbzley","type":"subheading","text":"Education Records"},{"id":"kyvtn7b","type":"paragraph","text":"Protects the privacy and confidentiality of student education records at all levels."},{"id":"3rupf0a","type":"subheading","text":"Parental Rights"},{"id":"7wk9wbl","type":"paragraph","text":"Grants parents the right to access and request corrections to their child''s records."},{"id":"n23a2gw","type":"subheading","text":"Consent"},{"id":"hyk59tv","type":"paragraph","text":"Requires written consent for disclosure of records, with specific exceptions."},{"id":"0ouqwdc","type":"subheading","text":"5.2.5 Personal Information Protection and Electronic Documents Act (PIPEDA)"},{"id":"ya1aj5j","type":"paragraph","text":"PIPEDA sets a federal standard for privacy protection in Canada, covering a wide range of private-sector organizations. It influences provincial laws and is often compared to GDPR for its comprehensive approach."},{"id":"790n39n","type":"subheading","text":"Consent:"},{"id":"21oo2hv","type":"paragraph","text":"Requires organizations to obtain consent for the collection, use, and disclosure of personal information."},{"id":"w6et1wi","type":"subheading","text":"Access & Correction:"},{"id":"jiehzx4","type":"paragraph","text":"Individuals have the right to access and request corrections to their personal information."},{"id":"ga5q889","type":"subheading","text":"Accountability:"},{"id":"tp1ga2i","type":"paragraph","text":"Organizations must be accountable for personal information under their control."},{"id":"s34qoi4","type":"subheading","text":"5.2.6 Institutional Review Board (IRB)"},{"id":"m6dvqa4","type":"paragraph","text":"IRB is a committee established to review and approve research involving human subjects, ensuring ethical standards are maintained."},{"id":"sch3dek","type":"subheading","text":"Purpose:"},{"id":"j3js6cd","type":"paragraph","text":"Protects the rights and welfare of human research participants during the research process."},{"id":"o7ty5p7","type":"subheading","text":"Scope:"},{"id":"rmrv9yn","type":"paragraph","text":"Primarily academic institutions and research organizations in the U.S. conducting human research."},{"id":"j6oukrd","type":"subheading","text":"Key Focus:"},{"id":"5irpmq4","type":"paragraph","text":"Ensuring ethical standards, obtaining informed consent, and protecting participant confidentiality."},{"id":"o69pp9m","type":"subheading","text":"5.2.7 PCI DSS (Payment Card Industry Data Security Standard)"},{"id":"m4ipic9","type":"paragraph","text":"PCI DSS is a set of security standards designed to ensure that ALL companies that accept, process, store or transmit credit card information maintain a secure environment."},{"id":"ekjtm3p","type":"subheading","text":"Purpose:"},{"id":"s8b0swa","type":"paragraph","text":"Protects cardholder data and ensures secure processing of credit card transactions."},{"id":"wpidnn1","type":"subheading","text":"Scope:"},{"id":"0azlhmh","type":"paragraph","text":"Applies to any organization that accepts, transmits, or stores credit card data."},{"id":"785dfra","type":"subheading","text":"Key Focus:"},{"id":"2ljfcup","type":"paragraph","text":"Encryption, secure networks, and regular monitoring to protect sensitive financial data."},{"id":"4eih5gz","type":"subheading","text":"Why These Laws Are Important"},{"id":"auhqn77","type":"subheading","text":"Global Impact"},{"id":"dwuw5ms","type":"paragraph","text":"Set new standards globally, affecting how companies operate beyond their own borders."},{"id":"19ozmf3","type":"subheading","text":"Protections"},{"id":"6xt5tpl","type":"paragraph","text":"Robust protection for individuals'' privacy and data, promoting trust and accountability."},{"id":"us9nrio","type":"subheading","text":"Influence"},{"id":"pyq56i9","type":"paragraph","text":"Newer privacy laws around the world have been modeled after the GDPR and CCPA standards."},{"id":"qt5byg9","type":"subheading","text":"Adaptability"},{"id":"ouz3jwv","type":"paragraph","text":"Designed to adapt to technological changes and emerging privacy challenges in a digital world."},{"id":"hqjn2g1","type":"heading","text":"5.3 Best Practices for Data Privacy"},{"id":"tn75ryw","type":"paragraph","text":"Data privacy refers to the protection of personal and sensitive information from unauthorized access, misuse, or disclosure. It ensures that data is collected, processed, stored, and shared in a secure and ethical manner, maintaining the confidentiality and rights of individuals."},{"id":"ayanxh2","type":"subheading","text":"5.3.1 Data Minimization"},{"id":"7jk5h9x","type":"list","title":"","points":["Collect only the data that is necessary","Avoid storing unnecessary personal information","Reduces risk of data misuse"]},{"id":"fm0i4og","type":"subheading","text":"5.3.2 Strong Access Control"},{"id":"170hxta","type":"list","title":"","points":["Limit data access to authorized users only","Use role-based access control (RBAC)","Implement multi-factor authentication (MFA)"]},{"id":"kpriwn9","type":"subheading","text":"5.3.3 Data Encryption"},{"id":"j833d65","type":"list","title":"","points":["Encrypt data both at rest and in transit","Protects data from unauthorized access","Use secure protocols (HTTPS, SSL/TLS)"]},{"id":"xhc1nwi","type":"subheading","text":"5.3.4 Regular Data Backup"},{"id":"anfzq5n","type":"list","title":"","points":["Maintain secure backups of important data","Helps in recovery during data loss","Store backups in secure locations"]},{"id":"5gck40a","type":"subheading","text":"5.3.5 Secure Systems"},{"id":"lss7xlq","type":"list","title":"","points":["Use trusted platforms like Excel, Power BI","Configure proper security settings","Keep software updated"]},{"id":"7cu8fj4","type":"subheading","text":"5.3.6 Data Anonymization"},{"id":"ufwom25","type":"list","title":"","points":["Remove or hide personal identifiers","Use masking, hashing, or pseudonymization","Protects identity while analyzing data"]},{"id":"le0fu7z","type":"subheading","text":"5.3.7 Training and Awareness"},{"id":"dqratu3","type":"list","title":"","points":["Educate employees and stakeholders","Teach data privacy best practices","Emphasize the importance of protecting data"]},{"id":"hqjao70","type":"subheading","text":"5.3.8 Compliance"},{"id":"r09fk2q","type":"list","title":"","points":["Follow legal frameworks like GDPR","Ensure data handling meets legal standards","Maintain proper documentation"]},{"id":"fcy40v5","type":"subheading","text":"5.3.9 Secure Storage"},{"id":"87trjbj","type":"list","title":"","points":["Store data in protected environments","Use firewalls and intrusion detection","Avoid unsecured locations"]},{"id":"terqc88","type":"subheading","text":"5.3.10 Audits & Updates"},{"id":"9kqy2d3","type":"list","title":"","points":["Regularly review privacy policies","Ensure ongoing compliance with laws","Update data practices as necessary"]},{"id":"1nqmuii","type":"subheading","text":"5.3.11 Retention Policies"},{"id":"u49q88m","type":"list","title":"","points":["Define how long data should be stored","Delete data that is no longer needed","Reduces risk of exposure"]},{"id":"5n4ep9u","type":"subheading","text":"5.3.12 Incident Response"},{"id":"685z8fp","type":"list","title":"","points":["Have a plan to handle data breaches","Quickly detect, respond, and recover","Minimize damage and impact"]},{"id":"4zaux5i","type":"subheading","text":"5.3.13 Consent & Transparency"},{"id":"180n5bx","type":"list","title":"","points":["Inform individuals on how data is used","Obtain explicit consent before collecting","Maintain transparent privacy practices"]},{"id":"atyaoo4","type":"subheading","text":"5.3.14 Secure Data Handling"},{"id":"yiiejvj","type":"list","title":"","points":["Protect data from unauthorized access & leaks","Use encryption and secure storage methods","Limit access strictly to necessary personnel"]},{"id":"7eryv5k","type":"subheading","text":"5.3.15 Anonymization"},{"id":"ick80j1","type":"list","title":"","points":["Anonymize data to prevent individual tracing","Pseudonymize by using artificial identifiers","Remove direct identifiers before data analysis"]},{"id":"d16oekq","type":"heading","text":"5.4 Types of Bias in Data Analysis"},{"id":"5dlmzip","type":"paragraph","text":"Bias in data analysis refers to a systematic error or distortion in data collection, processing, or interpretation that leads to inaccurate or misleading results. It occurs when the data or the method of analysis does not represent the true situation, causing conclusions to be skewed in a particular direction."},{"id":"sgzz0b9","type":"subheading","text":"5.4.1 Meaning"},{"id":"qjhqj85","type":"list","title":"","points":["Means lack of neutrality or fairness in data","Affects the accuracy and reliability of analysis","Leads to wrong conclusions and poor decision-making"]},{"id":"qts52ej","type":"subheading","text":"5.4.2 Causes of Bias"},{"id":"2c9hl2e","type":"list","title":"","points":["Poor data collection methods","Incomplete or unbalanced datasets","Human errors or assumptions","Improper analysis techniques"]},{"id":"vazxniy","type":"subheading","text":"5.4.3 Effects of Bias"},{"id":"2dv4hg8","type":"list","title":"","points":["Misleading insights","Wrong business or policy decisions","Reduced credibility of analysis","Ethical issues"]},{"id":"pndmmep","type":"subheading","text":"5.4.4 How to Reduce Bias"},{"id":"u57dd23","type":"list","title":"","points":["Use representative samples","Apply proper data collection methods","Validate and clean data carefully","Use multiple data sources","Maintain objectivity during analysis"]},{"id":"53k9km6","type":"subheading","text":"5.4.5 Common Types of Bias"},{"id":"ubonkqs","type":"subheading","text":"5.4.5.1 Sampling Bias"},{"id":"frm2ss7","type":"paragraph","text":"Occurs when the selected sample does not accurately represent the entire population. This leads to results that are skewed toward a particular group, reducing the validity of conclusions."},{"id":"w3pezbu","type":"subheading","text":"5.4.5.2 Measurement Bias"},{"id":"4db5uq0","type":"paragraph","text":"Arises when there are errors in data collection methods, tools, or instruments. This results in inaccurate data being recorded, which affects the overall analysis."},{"id":"phfxpod","type":"subheading","text":"5.4.5.3 Confirmation Bias"},{"id":"te3o5jh","type":"paragraph","text":"Occurs when analysts focus only on data that supports their existing beliefs or assumptions, overlooking contradictory data. This leads to one-sided conclusions."},{"id":"k48r13g","type":"subheading","text":"5.4.5.4 Non-response Bias"},{"id":"3ypqv1w","type":"paragraph","text":"Happens when certain individuals or groups do not respond to a survey. If the non-respondents differ significantly from respondents, the results become completely biased."},{"id":"s81dfyk","type":"subheading","text":"5.4.5.5 Selection Bias"},{"id":"6bt16o6","type":"paragraph","text":"Occurs when the method of selecting data or participants is not random and favors certain outcomes. It often overlaps with sampling bias but is more related to the selection process."},{"id":"vplh3wq","type":"subheading","text":"5.4.5.6 Data Processing Bias"},{"id":"rkmlk55","type":"paragraph","text":"Arises during data cleaning, transformation, or analysis stages. Errors such as incorrect filtering, coding mistakes, or improper aggregation can severely distort results."},{"id":"sc4bitj","type":"subheading","text":"5.4.5.7 Survivorship Bias"},{"id":"pdox456","type":"paragraph","text":"Occurs when analysis focuses only on successful or surviving cases, ignoring failures. This gives a distorted view of reality and overly optimistic conclusions."},{"id":"gpmbtb2","type":"subheading","text":"5.4.5.8 Recall Bias"},{"id":"vg939ns","type":"paragraph","text":"Happens when participants do not accurately remember past events or experiences. This leads to incorrect or incomplete data being collected, especially in interviews."},{"id":"iyfws5l","type":"subheading","text":"5.4.5.9 Observer Bias"},{"id":"wu3l8w1","type":"paragraph","text":"Occurs when the person collecting or analyzing data unintentionally influences the results. Personal opinions or expectations may affect how data is recorded or interpreted."},{"id":"3sj69k5","type":"subheading","text":"5.4.5.10 Algorithmic Bias"},{"id":"npqy0q4","type":"paragraph","text":"Occurs when a model or algorithm produces biased results due to biased training data or design. It can reinforce existing inequalities and unfair patterns in machine learning systems."},{"id":"6haax8f","type":"heading","text":"Module 5 Knowledge Check"},{"id":"p12qddd","type":"paragraph","text":"Test your understanding of data privacy laws and best practices."},{"id":"5w1ypi2","type":"assessment","title":"Practice Check","questions":[{"text":"Which data privacy regulation specifically applies to the protection of health information in the United States?","options":["CHECK ANSWER"],"correct":"2"}]},{"id":"7in04wh","type":"assessment","title":"Practice Check","questions":[{"text":"What is the core principle of \"Data Minimization\" in privacy best practices?","options":["CHECK ANSWER"],"correct":"1"}]},{"id":"pk2d0nk","type":"assessment","title":"Practice Check","questions":[{"text":"If an organization uses \"Role-Based Access Control (RBAC)\", which privacy best practice are they primarily enforcing?","options":["CHECK ANSWER"],"correct":"3"}]},{"id":"pkids0b","type":"assessment","title":"Practice Check","questions":[{"text":"Which practice ensures that data cannot be easily traced back to an individual during analysis?","options":["CHECK ANSWER"],"correct":"0"}]},{"id":"jdugywh","type":"assessment","title":"Practice Check","questions":[{"text":"Under regulations like the GDPR, what must organizations generally do before collecting personal data?","options":["CHECK ANSWER"],"correct":"1"}]},{"id":"3iqobtu","type":"subheading","text":"Ready for the Module 5 Assessment?"},{"id":"z7v5cgv","type":"paragraph","text":"Test your knowledge of data ethics, privacy laws, and bias mitigation."}]} -->
<h2 class="text-2xl font-extrabold text-white mt-12 mb-6 border-b border-white/10 pb-2">5.1 Responsible Data Analytics</h2>
<p class="text-slate-300 leading-relaxed mb-6">Responsible analytics is the practice of handling data ethically, securely, and legally. As data becomes the world''s most valuable resource, the responsibility to protect it grows exponentially.</p>
<p class="text-slate-300 leading-relaxed mb-6">It ensures that data is not just "processed" but handled with respect for individuals'' rights and business integrity.</p>
<div class="my-6 border-l-4 border-white bg-white/5 p-6 rounded-r-2xl text-left">
  <h4 class="text-white font-bold text-sm mb-3">Golden Rule</h4>
  <p class="text-slate-350 text-sm leading-relaxed mb-0">Just because you can technically extract certain insights from data doesn''t mean you should if it violates trust or ethics.</p>
</div>
<h2 class="text-2xl font-extrabold text-white mt-12 mb-6 border-b border-white/10 pb-2">5.2 Data Privacy Laws</h2>
<p class="text-slate-300 leading-relaxed mb-6">Data privacy laws are regulations designed to safeguard individuals'' personal data from misuse, unauthorized access, and breaches. These laws outline how organizations must collect, store, use, and share personal information to ensure that individuals'' privacy is respected and their data is protected.</p>
<p class="text-slate-300 leading-relaxed mb-6">Data privacy laws vary by region, but they generally aim to achieve four key objectives:</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Grant Individual Rights</h3>
<p class="text-slate-300 leading-relaxed mb-6">Provide individuals with rights regarding their personal data, including access, correction, and deletion.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Protect Personal Information</h3>
<p class="text-slate-300 leading-relaxed mb-6">Ensure that personal data, such as names, addresses, and financial information, is handled securely and confidentially.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Regulate Data Processing</h3>
<p class="text-slate-300 leading-relaxed mb-6">Set guidelines for how organizations collect, use, and share personal data to prevent abuse and unauthorized use.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Enforce Accountability</h3>
<p class="text-slate-300 leading-relaxed mb-6">Hold organizations accountable for data protection through audits, impact assessments, and significant penalties.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">5.2.1 General Data Protection Regulation (GDPR)</h3>
<p class="text-slate-300 leading-relaxed mb-6">GDPR is considered one of the most comprehensive data protection regulations globally. It sets a high standard for consent, data protection, and data subject rights. It applies to all organizations processing the personal data of EU citizens, regardless of the organization''s location.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Explicit Consent</h3>
<p class="text-slate-300 leading-relaxed mb-6">Requires clear, affirmative consent from individuals before any personal data is collected or processed.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Data Subject Rights</h3>
<p class="text-slate-300 leading-relaxed mb-6">Provides rights such as access, correction, erasure (right to be forgotten), and data portability.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Data Protection Officer (DPO)</h3>
<p class="text-slate-300 leading-relaxed mb-6">Organizations must appoint a DPO if they process large amounts of sensitive personal data.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Breach Notification</h3>
<p class="text-slate-300 leading-relaxed mb-6">Mandatory reporting of data breaches to authorities and individuals within 72 hours of discovery.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Severe Financial Penalties</h3>
<p class="text-slate-300 leading-relaxed mb-6">Non-compliance can result in significant fines (up to €20 million or 4% of global turnover, whichever is higher).</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">5.2.2 California Consumer Privacy Act (CCPA)</h3>
<p class="text-slate-300 leading-relaxed mb-6">CCPA is a pioneering state-level privacy law in the United States that provides significant privacy rights to California residents. It has set a precedent for other states considering similar legislation.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Consumer Rights</h3>
<p class="text-slate-300 leading-relaxed mb-6">Grants rights to know what personal data is being collected, to access it, and to request deletion.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Opt-Out Rights</h3>
<p class="text-slate-300 leading-relaxed mb-6">Provides the explicit right to opt out of the sale of personal information to third parties.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Data Protection</h3>
<p class="text-slate-300 leading-relaxed mb-6">Requires businesses to implement and maintain reasonable security measures to protect data.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Enforcement</h3>
<p class="text-slate-300 leading-relaxed mb-6">Violations can result in significant fines, penalties, and the possibility of private lawsuits.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">5.2.3 Health Insurance Portability and Accountability Act (HIPAA)</h3>
<p class="text-slate-300 leading-relaxed mb-6">HIPAA is a key regulation for protecting the privacy and security of health information in the U.S. It is essential for maintaining trust in the healthcare system.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Protected Health Information (PHI)</h3>
<p class="text-slate-300 leading-relaxed mb-6">Regulates the protection of all individually identifiable health information used in healthcare.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Security Rule</h3>
<p class="text-slate-300 leading-relaxed mb-6">Requires administrative, physical, and technical safeguards for electronic health information.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Privacy Rule</h3>
<p class="text-slate-300 leading-relaxed mb-6">Governs the use and disclosure of health information to ensure patient confidentiality.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Breach Notification Rule</h3>
<p class="text-slate-300 leading-relaxed mb-6">Mandates notifications to individuals and the HHS in case of any data breaches.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">5.2.4 Family Educational Rights and Privacy Act (FERPA)</h3>
<p class="text-slate-300 leading-relaxed mb-6">FERPA is important because it protects the privacy of student education records. It gives parents and eligible students the right to access and review these records and request corrections if they believe the records are inaccurate or misleading.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Education Records</h3>
<p class="text-slate-300 leading-relaxed mb-6">Protects the privacy and confidentiality of student education records at all levels.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Parental Rights</h3>
<p class="text-slate-300 leading-relaxed mb-6">Grants parents the right to access and request corrections to their child''s records.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Consent</h3>
<p class="text-slate-300 leading-relaxed mb-6">Requires written consent for disclosure of records, with specific exceptions.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">5.2.5 Personal Information Protection and Electronic Documents Act (PIPEDA)</h3>
<p class="text-slate-300 leading-relaxed mb-6">PIPEDA sets a federal standard for privacy protection in Canada, covering a wide range of private-sector organizations. It influences provincial laws and is often compared to GDPR for its comprehensive approach.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Consent:</h3>
<p class="text-slate-300 leading-relaxed mb-6">Requires organizations to obtain consent for the collection, use, and disclosure of personal information.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Access & Correction:</h3>
<p class="text-slate-300 leading-relaxed mb-6">Individuals have the right to access and request corrections to their personal information.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Accountability:</h3>
<p class="text-slate-300 leading-relaxed mb-6">Organizations must be accountable for personal information under their control.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">5.2.6 Institutional Review Board (IRB)</h3>
<p class="text-slate-300 leading-relaxed mb-6">IRB is a committee established to review and approve research involving human subjects, ensuring ethical standards are maintained.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Purpose:</h3>
<p class="text-slate-300 leading-relaxed mb-6">Protects the rights and welfare of human research participants during the research process.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Scope:</h3>
<p class="text-slate-300 leading-relaxed mb-6">Primarily academic institutions and research organizations in the U.S. conducting human research.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Key Focus:</h3>
<p class="text-slate-300 leading-relaxed mb-6">Ensuring ethical standards, obtaining informed consent, and protecting participant confidentiality.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">5.2.7 PCI DSS (Payment Card Industry Data Security Standard)</h3>
<p class="text-slate-300 leading-relaxed mb-6">PCI DSS is a set of security standards designed to ensure that ALL companies that accept, process, store or transmit credit card information maintain a secure environment.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Purpose:</h3>
<p class="text-slate-300 leading-relaxed mb-6">Protects cardholder data and ensures secure processing of credit card transactions.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Scope:</h3>
<p class="text-slate-300 leading-relaxed mb-6">Applies to any organization that accepts, transmits, or stores credit card data.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Key Focus:</h3>
<p class="text-slate-300 leading-relaxed mb-6">Encryption, secure networks, and regular monitoring to protect sensitive financial data.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Why These Laws Are Important</h3>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Global Impact</h3>
<p class="text-slate-300 leading-relaxed mb-6">Set new standards globally, affecting how companies operate beyond their own borders.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Protections</h3>
<p class="text-slate-300 leading-relaxed mb-6">Robust protection for individuals'' privacy and data, promoting trust and accountability.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Influence</h3>
<p class="text-slate-300 leading-relaxed mb-6">Newer privacy laws around the world have been modeled after the GDPR and CCPA standards.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Adaptability</h3>
<p class="text-slate-300 leading-relaxed mb-6">Designed to adapt to technological changes and emerging privacy challenges in a digital world.</p>
<h2 class="text-2xl font-extrabold text-white mt-12 mb-6 border-b border-white/10 pb-2">5.3 Best Practices for Data Privacy</h2>
<p class="text-slate-300 leading-relaxed mb-6">Data privacy refers to the protection of personal and sensitive information from unauthorized access, misuse, or disclosure. It ensures that data is collected, processed, stored, and shared in a secure and ethical manner, maintaining the confidentiality and rights of individuals.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">5.3.1 Data Minimization</h3>
<div class="my-6 text-left space-y-4">
  
  <ul class="space-y-3" style="list-style-type: none; padding-left: 0;">
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Collect only the data that is necessary</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Avoid storing unnecessary personal information</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Reduces risk of data misuse</span>
    </li>
  </ul>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">5.3.2 Strong Access Control</h3>
<div class="my-6 text-left space-y-4">
  
  <ul class="space-y-3" style="list-style-type: none; padding-left: 0;">
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Limit data access to authorized users only</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Use role-based access control (RBAC)</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Implement multi-factor authentication (MFA)</span>
    </li>
  </ul>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">5.3.3 Data Encryption</h3>
<div class="my-6 text-left space-y-4">
  
  <ul class="space-y-3" style="list-style-type: none; padding-left: 0;">
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Encrypt data both at rest and in transit</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Protects data from unauthorized access</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Use secure protocols (HTTPS, SSL/TLS)</span>
    </li>
  </ul>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">5.3.4 Regular Data Backup</h3>
<div class="my-6 text-left space-y-4">
  
  <ul class="space-y-3" style="list-style-type: none; padding-left: 0;">
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Maintain secure backups of important data</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Helps in recovery during data loss</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Store backups in secure locations</span>
    </li>
  </ul>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">5.3.5 Secure Systems</h3>
<div class="my-6 text-left space-y-4">
  
  <ul class="space-y-3" style="list-style-type: none; padding-left: 0;">
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Use trusted platforms like Excel, Power BI</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Configure proper security settings</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Keep software updated</span>
    </li>
  </ul>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">5.3.6 Data Anonymization</h3>
<div class="my-6 text-left space-y-4">
  
  <ul class="space-y-3" style="list-style-type: none; padding-left: 0;">
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Remove or hide personal identifiers</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Use masking, hashing, or pseudonymization</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Protects identity while analyzing data</span>
    </li>
  </ul>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">5.3.7 Training and Awareness</h3>
<div class="my-6 text-left space-y-4">
  
  <ul class="space-y-3" style="list-style-type: none; padding-left: 0;">
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Educate employees and stakeholders</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Teach data privacy best practices</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Emphasize the importance of protecting data</span>
    </li>
  </ul>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">5.3.8 Compliance</h3>
<div class="my-6 text-left space-y-4">
  
  <ul class="space-y-3" style="list-style-type: none; padding-left: 0;">
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Follow legal frameworks like GDPR</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Ensure data handling meets legal standards</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Maintain proper documentation</span>
    </li>
  </ul>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">5.3.9 Secure Storage</h3>
<div class="my-6 text-left space-y-4">
  
  <ul class="space-y-3" style="list-style-type: none; padding-left: 0;">
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Store data in protected environments</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Use firewalls and intrusion detection</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Avoid unsecured locations</span>
    </li>
  </ul>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">5.3.10 Audits & Updates</h3>
<div class="my-6 text-left space-y-4">
  
  <ul class="space-y-3" style="list-style-type: none; padding-left: 0;">
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Regularly review privacy policies</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Ensure ongoing compliance with laws</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Update data practices as necessary</span>
    </li>
  </ul>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">5.3.11 Retention Policies</h3>
<div class="my-6 text-left space-y-4">
  
  <ul class="space-y-3" style="list-style-type: none; padding-left: 0;">
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Define how long data should be stored</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Delete data that is no longer needed</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Reduces risk of exposure</span>
    </li>
  </ul>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">5.3.12 Incident Response</h3>
<div class="my-6 text-left space-y-4">
  
  <ul class="space-y-3" style="list-style-type: none; padding-left: 0;">
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Have a plan to handle data breaches</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Quickly detect, respond, and recover</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Minimize damage and impact</span>
    </li>
  </ul>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">5.3.13 Consent & Transparency</h3>
<div class="my-6 text-left space-y-4">
  
  <ul class="space-y-3" style="list-style-type: none; padding-left: 0;">
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Inform individuals on how data is used</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Obtain explicit consent before collecting</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Maintain transparent privacy practices</span>
    </li>
  </ul>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">5.3.14 Secure Data Handling</h3>
<div class="my-6 text-left space-y-4">
  
  <ul class="space-y-3" style="list-style-type: none; padding-left: 0;">
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Protect data from unauthorized access & leaks</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Use encryption and secure storage methods</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Limit access strictly to necessary personnel</span>
    </li>
  </ul>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">5.3.15 Anonymization</h3>
<div class="my-6 text-left space-y-4">
  
  <ul class="space-y-3" style="list-style-type: none; padding-left: 0;">
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Anonymize data to prevent individual tracing</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Pseudonymize by using artificial identifiers</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Remove direct identifiers before data analysis</span>
    </li>
  </ul>
</div>
<h2 class="text-2xl font-extrabold text-white mt-12 mb-6 border-b border-white/10 pb-2">5.4 Types of Bias in Data Analysis</h2>
<p class="text-slate-300 leading-relaxed mb-6">Bias in data analysis refers to a systematic error or distortion in data collection, processing, or interpretation that leads to inaccurate or misleading results. It occurs when the data or the method of analysis does not represent the true situation, causing conclusions to be skewed in a particular direction.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">5.4.1 Meaning</h3>
<div class="my-6 text-left space-y-4">
  
  <ul class="space-y-3" style="list-style-type: none; padding-left: 0;">
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Means lack of neutrality or fairness in data</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Affects the accuracy and reliability of analysis</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Leads to wrong conclusions and poor decision-making</span>
    </li>
  </ul>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">5.4.2 Causes of Bias</h3>
<div class="my-6 text-left space-y-4">
  
  <ul class="space-y-3" style="list-style-type: none; padding-left: 0;">
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Poor data collection methods</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Incomplete or unbalanced datasets</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Human errors or assumptions</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Improper analysis techniques</span>
    </li>
  </ul>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">5.4.3 Effects of Bias</h3>
<div class="my-6 text-left space-y-4">
  
  <ul class="space-y-3" style="list-style-type: none; padding-left: 0;">
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Misleading insights</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Wrong business or policy decisions</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Reduced credibility of analysis</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Ethical issues</span>
    </li>
  </ul>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">5.4.4 How to Reduce Bias</h3>
<div class="my-6 text-left space-y-4">
  
  <ul class="space-y-3" style="list-style-type: none; padding-left: 0;">
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Use representative samples</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Apply proper data collection methods</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Validate and clean data carefully</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Use multiple data sources</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-350 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>Maintain objectivity during analysis</span>
    </li>
  </ul>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">5.4.5 Common Types of Bias</h3>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">5.4.5.1 Sampling Bias</h3>
<p class="text-slate-300 leading-relaxed mb-6">Occurs when the selected sample does not accurately represent the entire population. This leads to results that are skewed toward a particular group, reducing the validity of conclusions.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">5.4.5.2 Measurement Bias</h3>
<p class="text-slate-300 leading-relaxed mb-6">Arises when there are errors in data collection methods, tools, or instruments. This results in inaccurate data being recorded, which affects the overall analysis.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">5.4.5.3 Confirmation Bias</h3>
<p class="text-slate-300 leading-relaxed mb-6">Occurs when analysts focus only on data that supports their existing beliefs or assumptions, overlooking contradictory data. This leads to one-sided conclusions.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">5.4.5.4 Non-response Bias</h3>
<p class="text-slate-300 leading-relaxed mb-6">Happens when certain individuals or groups do not respond to a survey. If the non-respondents differ significantly from respondents, the results become completely biased.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">5.4.5.5 Selection Bias</h3>
<p class="text-slate-300 leading-relaxed mb-6">Occurs when the method of selecting data or participants is not random and favors certain outcomes. It often overlaps with sampling bias but is more related to the selection process.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">5.4.5.6 Data Processing Bias</h3>
<p class="text-slate-300 leading-relaxed mb-6">Arises during data cleaning, transformation, or analysis stages. Errors such as incorrect filtering, coding mistakes, or improper aggregation can severely distort results.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">5.4.5.7 Survivorship Bias</h3>
<p class="text-slate-300 leading-relaxed mb-6">Occurs when analysis focuses only on successful or surviving cases, ignoring failures. This gives a distorted view of reality and overly optimistic conclusions.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">5.4.5.8 Recall Bias</h3>
<p class="text-slate-300 leading-relaxed mb-6">Happens when participants do not accurately remember past events or experiences. This leads to incorrect or incomplete data being collected, especially in interviews.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">5.4.5.9 Observer Bias</h3>
<p class="text-slate-300 leading-relaxed mb-6">Occurs when the person collecting or analyzing data unintentionally influences the results. Personal opinions or expectations may affect how data is recorded or interpreted.</p>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">5.4.5.10 Algorithmic Bias</h3>
<p class="text-slate-300 leading-relaxed mb-6">Occurs when a model or algorithm produces biased results due to biased training data or design. It can reinforce existing inequalities and unfair patterns in machine learning systems.</p>
<h2 class="text-2xl font-extrabold text-white mt-12 mb-6 border-b border-white/10 pb-2">Module 5 Knowledge Check</h2>
<p class="text-slate-300 leading-relaxed mb-6">Test your understanding of data privacy laws and best practices.</p>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-6sagx1f" data-questions="[{&quot;text&quot;:&quot;Which data privacy regulation specifically applies to the protection of health information in the United States?&quot;,&quot;options&quot;:[&quot;CHECK ANSWER&quot;],&quot;correct&quot;:&quot;2&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. Which data privacy regulation specifically applies to the protection of health information in the United States?</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>CHECK ANSWER</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-6sagx1f'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-kc1blwm" data-questions="[{&quot;text&quot;:&quot;What is the core principle of \&quot;Data Minimization\&quot; in privacy best practices?&quot;,&quot;options&quot;:[&quot;CHECK ANSWER&quot;],&quot;correct&quot;:&quot;1&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. What is the core principle of &quot;Data Minimization&quot; in privacy best practices?</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>CHECK ANSWER</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-kc1blwm'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-8gmilol" data-questions="[{&quot;text&quot;:&quot;If an organization uses \&quot;Role-Based Access Control (RBAC)\&quot;, which privacy best practice are they primarily enforcing?&quot;,&quot;options&quot;:[&quot;CHECK ANSWER&quot;],&quot;correct&quot;:&quot;3&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. If an organization uses &quot;Role-Based Access Control (RBAC)&quot;, which privacy best practice are they primarily enforcing?</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>CHECK ANSWER</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-8gmilol'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-i20hs0y" data-questions="[{&quot;text&quot;:&quot;Which practice ensures that data cannot be easily traced back to an individual during analysis?&quot;,&quot;options&quot;:[&quot;CHECK ANSWER&quot;],&quot;correct&quot;:&quot;0&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. Which practice ensures that data cannot be easily traced back to an individual during analysis?</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>CHECK ANSWER</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-i20hs0y'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<div class="my-8 p-6 bg-[#0B2A22]/40 border border-white/5 rounded-2xl text-left space-y-6" id="quiz-uhy5s54" data-questions="[{&quot;text&quot;:&quot;Under regulations like the GDPR, what must organizations generally do before collecting personal data?&quot;,&quot;options&quot;:[&quot;CHECK ANSWER&quot;],&quot;correct&quot;:&quot;1&quot;}]">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      Practice Check
    </h4>
    <span class="text-xs text-slate-400 font-mono">1 Questions</span>
  </div>
  <div class="space-y-6">
    <div class="space-y-3" data-qidx="0">
        <p class="text-slate-200 text-sm font-medium">1. Under regulations like the GDPR, what must organizations generally do before collecting personal data?</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-350 text-xs transition-all flex items-center justify-between group" data-optidx="0" onclick="
            const parent = this.closest(''[data-qidx]'');
            parent.querySelectorAll(''button'').forEach(btn => btn.className = btn.className.replace('' border-brand bg-brand/10 text-white'', '' border-white/5 bg-white/5 text-slate-350''));
            this.className += '' border-brand bg-brand/10 text-white'';
            parent.setAttribute(''data-selected'', ''0'');
          ">
            <span>CHECK ANSWER</span>
            <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
          </button>
        </div>
      </div>
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest(''#quiz-uhy5s54'');
      const questions = JSON.parse(quiz.dataset.questions || ''[]'');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll(''[data-qidx]'').forEach((qEl, idx) => {
        const selected = qEl.getAttribute(''data-selected'');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : ''0'';
        const buttons = qEl.querySelectorAll(''button'');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace(''bg-white/5'',''bg-green-500/10'').replace(''border-white/5'',''border-green-500/30'').replace(''text-slate-355'',''text-green-400'').replace(''text-slate-350'',''text-green-400'');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace(''bg-white/5'',''bg-red-500/10'').replace(''border-white/5'',''border-red-500/30'').replace(''text-slate-355'',''text-red-400'').replace(''text-slate-350'',''text-red-400'');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert(''Please answer all questions before submitting.''); return; }
      this.style.display = ''none'';
      const result = document.createElement(''div'');
      result.className = ''text-sm font-bold text-brand mt-2'';
      result.textContent = ''Score: '' + correct + '' / '' + questions.length + '' correct answers!'';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: ''KVJ_ACTIVITY_RESULT'', score: correct, maxScore: questions.length }, ''*'');
      } catch (e) {
        console.error(''Failed to post activity result:'', e);
      }
    \">Submit Answers</button>
  </div>
</div>
<h3 class="text-xl font-bold text-emerald-400 mt-8 mb-4">Ready for the Module 5 Assessment?</h3>
<p class="text-slate-300 leading-relaxed mb-6">Test your knowledge of data ethics, privacy laws, and bias mitigation.</p>
',
  1
) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, kind = EXCLUDED.kind, content_html = EXCLUDED.content_html, display_order = EXCLUDED.display_order;
INSERT INTO public.lessons (id, module_id, title, kind, content_html, display_order)
VALUES (
  '5cb7a4e2-d9f1-487b-aa58-c2b694b8e205',
  '7a2e84cf-81b4-4e9b-a01c-6d9b3a0f7e05',
  'Module 5 Assessment',
  'assessment',
  '',
  2
) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, kind = EXCLUDED.kind, content_html = EXCLUDED.content_html, display_order = EXCLUDED.display_order;

INSERT INTO public.mock_tests (id, course_id, lesson_id, title, duration_mins, pass_mark, randomize, display_order)
VALUES ('f18b4e92-76dc-40ab-96f1-285b7396c001', '8d7e98a3-c40d-4876-8051-789a64f5da04', '5cb7a4e2-d9f1-487b-aa58-c2b694b8e201', 'Module 1 Assessment', 20, 70, true, 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, duration_mins = EXCLUDED.duration_mins, pass_mark = EXCLUDED.pass_mark, randomize = EXCLUDED.randomize, display_order = EXCLUDED.display_order;
INSERT INTO public.mock_tests (id, course_id, lesson_id, title, duration_mins, pass_mark, randomize, display_order)
VALUES ('f18b4e92-76dc-40ab-96f1-285b7396c002', '8d7e98a3-c40d-4876-8051-789a64f5da04', '5cb7a4e2-d9f1-487b-aa58-c2b694b8e202', 'Module 2 Assessment', 20, 70, true, 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, duration_mins = EXCLUDED.duration_mins, pass_mark = EXCLUDED.pass_mark, randomize = EXCLUDED.randomize, display_order = EXCLUDED.display_order;
INSERT INTO public.mock_tests (id, course_id, lesson_id, title, duration_mins, pass_mark, randomize, display_order)
VALUES ('f18b4e92-76dc-40ab-96f1-285b7396c003', '8d7e98a3-c40d-4876-8051-789a64f5da04', '5cb7a4e2-d9f1-487b-aa58-c2b694b8e203', 'Module 3 Assessment', 20, 70, true, 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, duration_mins = EXCLUDED.duration_mins, pass_mark = EXCLUDED.pass_mark, randomize = EXCLUDED.randomize, display_order = EXCLUDED.display_order;
INSERT INTO public.mock_tests (id, course_id, lesson_id, title, duration_mins, pass_mark, randomize, display_order)
VALUES ('f18b4e92-76dc-40ab-96f1-285b7396c004', '8d7e98a3-c40d-4876-8051-789a64f5da04', '5cb7a4e2-d9f1-487b-aa58-c2b694b8e204', 'Module 4 Assessment', 20, 70, true, 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, duration_mins = EXCLUDED.duration_mins, pass_mark = EXCLUDED.pass_mark, randomize = EXCLUDED.randomize, display_order = EXCLUDED.display_order;
INSERT INTO public.mock_tests (id, course_id, lesson_id, title, duration_mins, pass_mark, randomize, display_order)
VALUES ('f18b4e92-76dc-40ab-96f1-285b7396c005', '8d7e98a3-c40d-4876-8051-789a64f5da04', '5cb7a4e2-d9f1-487b-aa58-c2b694b8e205', 'Module 5 Assessment', 20, 70, true, 5)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, duration_mins = EXCLUDED.duration_mins, pass_mark = EXCLUDED.pass_mark, randomize = EXCLUDED.randomize, display_order = EXCLUDED.display_order;
INSERT INTO public.mock_tests (id, course_id, lesson_id, title, duration_mins, pass_mark, randomize, display_order)
VALUES ('f18b4e92-76dc-40ab-96f1-285b7396d001', '8d7e98a3-c40d-4876-8051-789a64f5da04', NULL, 'Data Analytics Mock Test 1', 45, 75, true, 6)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, duration_mins = EXCLUDED.duration_mins, pass_mark = EXCLUDED.pass_mark, randomize = EXCLUDED.randomize, display_order = EXCLUDED.display_order;
INSERT INTO public.mock_tests (id, course_id, lesson_id, title, duration_mins, pass_mark, randomize, display_order)
VALUES ('f18b4e92-76dc-40ab-96f1-285b7396d002', '8d7e98a3-c40d-4876-8051-789a64f5da04', NULL, 'Data Analytics Mock Test 2', 45, 75, true, 7)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, duration_mins = EXCLUDED.duration_mins, pass_mark = EXCLUDED.pass_mark, randomize = EXCLUDED.randomize, display_order = EXCLUDED.display_order;
INSERT INTO public.mock_tests (id, course_id, lesson_id, title, duration_mins, pass_mark, randomize, display_order)
VALUES ('f18b4e92-76dc-40ab-96f1-285b7396d003', '8d7e98a3-c40d-4876-8051-789a64f5da04', NULL, 'Data Analytics Mock Test 3', 45, 75, true, 8)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, duration_mins = EXCLUDED.duration_mins, pass_mark = EXCLUDED.pass_mark, randomize = EXCLUDED.randomize, display_order = EXCLUDED.display_order;

INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '3456789a-cdef-4234-a789-bcdef0123456',
  'f18b4e92-76dc-40ab-96f1-285b7396c001',
  'single',
  'Which of the following scenarios best illustrates the difference between data and information?',
  1,
  '{"options":["A list of temperatures is information, while a chart showing them is data.","Random numbers are data, while knowing these represent daily sales is information.","A printed textbook is data, while a digital ebook is information.","Data is always numbers, while information is always words."],"correctIndex":1,"explanation":"Processing raw numbers into daily sales adds the necessary context, successfully turning meaningless data into actionable information."}'::jsonb,
  1
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '456789ab-def0-4345-b89a-cdef01234567',
  'f18b4e92-76dc-40ab-96f1-285b7396c001',
  'single',
  'Which level of the hierarchy is characterized by being ''action-oriented'' and built through experience and reflection?',
  1,
  '{"options":["Metadata","Information","Knowledge","Data"],"correctIndex":2,"explanation":"Knowledge represents the application of information to make decisions and solve problems based on experience."}'::jsonb,
  2
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '56789abc-ef01-4456-89ab-def012345678',
  'f18b4e92-76dc-40ab-96f1-285b7396c001',
  'truefalse',
  'Raw data is often meaningless on its own because it lacks context and organization.',
  1,
  '{"correct":true,"explanation":"Based on module concepts."}'::jsonb,
  3
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '6789abcd-f012-4567-9abc-ef0123456789',
  'f18b4e92-76dc-40ab-96f1-285b7396c001',
  'truefalse',
  'Information is the highest level of the hierarchy and represents the final stage of understanding.',
  1,
  '{"correct":false,"explanation":"Based on module concepts."}'::jsonb,
  4
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '789abcde-0123-4678-abcd-f0123456789a',
  'f18b4e92-76dc-40ab-96f1-285b7396c001',
  'truefalse',
  'Summarizing a large spreadsheet of sales figures into a monthly growth chart is an example of creating knowledge.',
  1,
  '{"correct":false,"explanation":"Based on module concepts."}'::jsonb,
  5
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '89abcdef-1234-4789-bcde-0123456789ab',
  'f18b4e92-76dc-40ab-96f1-285b7396c001',
  'single',
  'Which data type is most appropriate for a variable that tracks whether a customer is a premium subscriber or not?',
  1,
  '{"options":["String","Float","Boolean","Integer"],"correctIndex":2,"explanation":"A Boolean data type is perfect for this as it represents a logical state with only two possible values: True (Premium) or False (Not Premium)."}'::jsonb,
  6
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '9abcdef0-2345-489a-8def-123456789abc',
  'f18b4e92-76dc-40ab-96f1-285b7396c001',
  'single',
  'If you are recording the exact temperature in degrees Celsius (e.g., 23.5), which data type must you use to maintain accuracy?',
  1,
  '{"options":["Integer","Float","Boolean","Complex"],"correctIndex":1,"explanation":"Floats are used for numbers with fractional or decimal parts, which is necessary for precise measurements like 23.5."}'::jsonb,
  7
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  'abcdef01-3456-49ab-9ef0-23456789abcd',
  'f18b4e92-76dc-40ab-96f1-285b7396c001',
  'single',
  'Which of the following is the best example of a String data type?',
  1,
  '{"options":["3.14159","\"Hello World\"","True","42"],"correctIndex":1,"explanation":"Strings are sequences of characters enclosed in quotes, used to represent text."}'::jsonb,
  8
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  'bcdef012-4567-4abc-af01-3456789abcde',
  'f18b4e92-76dc-40ab-96f1-285b7396c001',
  'single',
  'In the complex number expression a + bi, what does the i represent?',
  1,
  '{"options":["An integer variable","The real part","The imaginary unit","A floating-point number"],"correctIndex":2,"explanation":"The i represents the imaginary unit, which has the unique mathematical property where i&sup2; = -1."}'::jsonb,
  9
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  'cdef0123-5678-4bcd-b012-456789abcdef',
  'f18b4e92-76dc-40ab-96f1-285b7396c001',
  'single',
  'In Excel, if you enter a whole number into a cell, what data type is it automatically treated as?',
  1,
  '{"options":["Float","String","Integer","Boolean"],"correctIndex":2,"explanation":"Excel natively treats whole numbers (numbers without decimal points) as integers."}'::jsonb,
  10
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '456789ab-def0-4345-b89a-cdef01234567',
  'f18b4e92-76dc-40ab-96f1-285b7396c001',
  'single',
  'Which data structure is "locked" or immutable, meaning its elements cannot be changed after creation?',
  1,
  '{"options":["List","Tuple","Dictionary","Set"],"correctIndex":1,"explanation":"A Tuple is immutable (locked), making it safer for data that should stay constant like GPS coordinates."}'::jsonb,
  11
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '3456789a-cdef-4234-a789-bcdef0123456',
  'f18b4e92-76dc-40ab-96f1-285b7396c001',
  'single',
  'Which data structure automatically removes any duplicate items you try to add?',
  1,
  '{"options":["List","Tuple","Set","Table"],"correctIndex":2,"explanation":"A Set acts like a bag of unique items and does not allow duplicate values."}'::jsonb,
  12
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '23456789-bcde-4123-9678-abcdef012345',
  'f18b4e92-76dc-40ab-96f1-285b7396c001',
  'single',
  'How are elements typically represented in a Dictionary?',
  1,
  '{"options":["index: value","key: value","row: column","value only"],"correctIndex":1,"explanation":"Dictionaries store data in pairs: a unique Key and its associated Value, making it easy to retrieve data using labels."}'::jsonb,
  13
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '12345678-abcd-4012-8567-9abcdef01234',
  'f18b4e92-76dc-40ab-96f1-285b7396c001',
  'single',
  'Which brackets are used to define a List in Python?',
  1,
  '{"options":["Parentheses ( )","Curly Braces { }","Square Brackets [ ]","Angle Brackets < >"],"correctIndex":2,"explanation":"Lists are always defined using Square Brackets [ ] in Python."}'::jsonb,
  14
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '01234567-9abc-4f01-b456-89abcdef0123',
  'f18b4e92-76dc-40ab-96f1-285b7396c001',
  'single',
  'Which brackets are used to define both Sets and Dictionaries?',
  1,
  '{"options":["Square Brackets [ ]","Curly Braces { }","Parentheses ( )","Double Quotes \" \""],"correctIndex":1,"explanation":"Both Sets and Dictionaries use Curly Braces { }, but Dictionaries use key:value pairs inside."}'::jsonb,
  15
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  'f0123456-89ab-4ef0-a345-789abcdef012',
  'f18b4e92-76dc-40ab-96f1-285b7396c001',
  'single',
  'Which of the following is considered "Unstructured Data"?',
  1,
  '{"options":["A SQL database table with rows and columns","A social media post containing text and an image","An Excel spreadsheet of monthly expenses","A bank statement in CSV format"],"correctIndex":1,"explanation":"Social media posts, emails, and images are unstructured because they do not fit into a fixed row-and-column format."}'::jsonb,
  16
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  'ef012345-789a-4def-9234-6789abcdef01',
  'f18b4e92-76dc-40ab-96f1-285b7396c001',
  'single',
  'Metadata is best defined as:',
  1,
  '{"options":["Data that has been deleted from a system","\"Data about data\" that describes its characteristics","Encrypted data used for security purposes","Large datasets that require supercomputers to process"],"correctIndex":1,"explanation":"Metadata provides context like creation date, dimensions, and file type, effectively acting as data about data."}'::jsonb,
  17
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  'def01234-6789-4cde-8123-56789abcdef0',
  'f18b4e92-76dc-40ab-96f1-285b7396c001',
  'single',
  'What is a primary characteristic of "Raw Data"?',
  1,
  '{"options":["It is already cleaned and ready for final analysis","It takes up very little storage space","It is unprocessed and full of \"noise\" (errors or duplicates)","It has been interpreted by humans to remove bias"],"correctIndex":2,"explanation":"Raw data is the initial collection of facts before any filtering or cleaning has occurred, often containing redundant or erroneous information."}'::jsonb,
  18
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '456789ab-def0-4345-b89a-cdef01234567',
  'f18b4e92-76dc-40ab-96f1-285b7396c002',
  'single',
  'In the ''Extract'' stage of ETL, what is a common challenge when dealing with multiple source systems like CRM, ERP, and legacy flat files?',
  1,
  '{"options":["Data must be converted to Python code immediately","Source systems may have different data formats and structures that need consolidation","Extraction always deletes the data from the source system to save space","Only cloud-based data can be extracted using ETL tools"],"correctIndex":1,"explanation":"Correct! Extraction involves retrieving data from various, often disparate source systems, which is the first step toward creating a unified dataset."}'::jsonb,
  1
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '56789abc-ef01-4456-89ab-def012345678',
  'f18b4e92-76dc-40ab-96f1-285b7396c002',
  'single',
  'Which loading strategy involves adding only the records that have been created or changed since the last execution to the data warehouse?',
  1,
  '{"options":["Full Load","Initial Load","Incremental Load","Static Load"],"correctIndex":2,"explanation":"Correct! Incremental Load is efficient because it only processes updates, rather than re-importing the entire dataset every time."}'::jsonb,
  2
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '6789abcd-f012-4567-9abc-ef0123456789',
  'f18b4e92-76dc-40ab-96f1-285b7396c002',
  'single',
  'When a dataset has a column with many outliers (extreme values), which imputation method is generally preferred to fill missing values?',
  1,
  '{"options":["Mean Imputation","Median Imputation","Zero Imputation","Drop the column"],"correctIndex":1,"explanation":"Median imputation is more robust to outliers than mean imputation, as it uses the middle value which is less affected by extreme scores."}'::jsonb,
  3
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '789abcde-0123-4678-abcd-f0123456789a',
  'f18b4e92-76dc-40ab-96f1-285b7396c002',
  'single',
  'In which library in Python is commonly used with Regular Expressions (Regex) to find and replace special characters in a string?',
  1,
  '{"options":["math","pandas","re","json"],"correctIndex":2,"explanation":"The re module in Python provides support for regular expressions, which are essential for identifying and removing unwanted characters."}'::jsonb,
  4
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '89abcdef-1234-4789-bcde-0123456789ab',
  'f18b4e92-76dc-40ab-96f1-285b7396c002',
  'single',
  'Which string method in Python is used to remove both leading and trailing white spaces from a text variable?',
  1,
  '{"options":[".remove()",".strip()",".clean()",".trim()"],"correctIndex":1,"explanation":"The .strip() method removes any leading (beginning) and trailing (end) whitespace characters from a string."}'::jsonb,
  5
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '9abcdef0-2345-489a-8def-123456789abc',
  'f18b4e92-76dc-40ab-96f1-285b7396c002',
  'single',
  'You need to organize a list of employee names in reverse alphabetical order (Z to A). Which sorting method is required?',
  1,
  '{"options":["Ascending Order","Descending Order","Random Sorting"],"correctIndex":1,"explanation":"Correct! Descending order (Z-A or 10-1) is used for reverse alphabetical arrangement."}'::jsonb,
  6
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  'abcdef01-3456-49ab-9ef0-23456789abcd',
  'f18b4e92-76dc-40ab-96f1-285b7396c002',
  'single',
  'You have a report where ''Year'' is currently the row header and ''Region'' is the column header. You need to flip the report so ''Region'' becomes the rows and ''Year'' becomes the columns. Which operation should you use?',
  1,
  '{"options":["Filtering","Transposing","Merging"],"correctIndex":1,"explanation":"Correct! Transposing changes the orientation of the data, switching rows and columns."}'::jsonb,
  7
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  'bcdef012-4567-4abc-af01-3456789abcde',
  'f18b4e92-76dc-40ab-96f1-285b7396c002',
  'single',
  'At the end of each day, you add new sales records to the bottom of your master ''Sales_History'' file. This process of adding new rows to an existing dataset is known as:',
  1,
  '{"options":["Appending","Merging","Slicing"],"correctIndex":0,"explanation":"Correct! Appending adds new data points vertically to the end of an existing dataset."}'::jsonb,
  8
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  'cdef0123-5678-4bcd-b012-456789abcdef',
  'f18b4e92-76dc-40ab-96f1-285b7396c002',
  'single',
  'You are working with a massive dataset of 5 million records. To test your logic quickly, you decide to only use the top 100 rows. what is this technique called?',
  1,
  '{"options":["Transposing","Truncating","Sorting"],"correctIndex":1,"explanation":"Correct! Truncating reduces the dataset to a specific length for better performance and testing."}'::jsonb,
  9
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  'def01234-6789-4cde-8123-56789abcdef0',
  'f18b4e92-76dc-40ab-96f1-285b7396c002',
  'single',
  'You want to connect a ''Customer'' table with an ''Orders'' table. Both tables must share a specific piece of information to link the records correctly. what is this shared information called?',
  1,
  '{"options":["A Filter","A Relational Key (or Common ID)","A Summary Row"],"correctIndex":1,"explanation":"Correct! Merging requires a relational join key to connect disparate data sources accurately."}'::jsonb,
  10
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '56789abc-ef01-4456-89ab-def012345678',
  'f18b4e92-76dc-40ab-96f1-285b7396c002',
  'single',
  'Question',
  1,
  '{"options":["COUNT","SUM","AVG","MAX"],"correctIndex":1,"explanation":"Correct! SUM calculates the total numerical value within each group."}'::jsonb,
  11
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '456789ab-def0-4345-b89a-cdef01234567',
  'f18b4e92-76dc-40ab-96f1-285b7396c002',
  'single',
  'Question',
  1,
  '{"options":["It expands the data horizontally by adding more columns.","It hides columns that contain categorical data.","It collapses many rows into a few key \"bottom-line\" numbers.","It sorts the data in descending order automatically."],"correctIndex":2,"explanation":"Correct! Summarizing collapses data vertically to give an overview."}'::jsonb,
  12
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '3456789a-cdef-4234-a789-bcdef0123456',
  'f18b4e92-76dc-40ab-96f1-285b7396c002',
  'single',
  'Question',
  1,
  '{"options":["df.info()","df.head()","df.describe()","df.summarize()"],"correctIndex":2,"explanation":"Correct! .describe() is the standard method for summary statistics in Pandas."}'::jsonb,
  13
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '23456789-bcde-4123-9678-abcdef012345',
  'f18b4e92-76dc-40ab-96f1-285b7396c002',
  'single',
  'Question',
  1,
  '{"options":["SUM","COUNT","AVG","MIN"],"correctIndex":1,"explanation":"Correct! COUNT determines the distribution of items (rows) in each group."}'::jsonb,
  14
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '12345678-abcd-4012-8567-9abcdef01234',
  'f18b4e92-76dc-40ab-96f1-285b7396c002',
  'single',
  'Question',
  1,
  '{"options":["Delete duplicate rows from the dataset.","Reshape data by converting rows into columns for structured reports.","Sort data based on alphabetical order.","Fill in missing values with the mean of the column."],"correctIndex":1,"explanation":"Correct! Pivoting reorganizes data to view it from a different perspective."}'::jsonb,
  15
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '56789abc-ef01-4456-89ab-def012345678',
  'f18b4e92-76dc-40ab-96f1-285b7396c003',
  'single',
  'Question',
  1,
  '{"options":["Predictive Analytics","Exploratory Data Analysis (EDA)","Prescriptive Analytics","Diagnostic Analytics"],"correctIndex":1,"explanation":"Correct! EDA is the crucial initial phase where you summarize data characteristics and spot anomalies."}'::jsonb,
  1
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '6789abcd-f012-4567-9abc-ef0123456789',
  'f18b4e92-76dc-40ab-96f1-285b7396c003',
  'single',
  'Question',
  1,
  '{"options":["Descriptive Analytics","Diagnostic Analytics","Predictive Analytics","Prescriptive Analytics"],"correctIndex":1,"explanation":"Correct! Diagnostic analytics focuses on determining why something happened by identifying root causes."}'::jsonb,
  2
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '789abcde-0123-4678-abcd-f0123456789a',
  'f18b4e92-76dc-40ab-96f1-285b7396c003',
  'single',
  'Question',
  1,
  '{"options":["Aggregation","Disaggregation (Drill-Down)","Data Cleaning","Predictive Modeling"],"correctIndex":1,"explanation":"Correct! Drilling down involves disaggregating data to see more granular levels."}'::jsonb,
  3
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '89abcdef-1234-4789-bcde-0123456789ab',
  'f18b4e92-76dc-40ab-96f1-285b7396c003',
  'single',
  'Question',
  1,
  '{"options":["To investigate granular details and identify the root cause of specific data errors or outliers.","To automatically delete all duplicate records.","To summarize data into higher-level categories only.","To change the underlying structure of the database."],"correctIndex":0,"explanation":"Correct! Drilling down allows analysts to pinpoint where inconsistencies or outliers are originating."}'::jsonb,
  4
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '9abcdef0-2345-489a-8def-123456789abc',
  'f18b4e92-76dc-40ab-96f1-285b7396c003',
  'single',
  'Question',
  1,
  '{"options":["Data Warehousing","Artificial Intelligence (AI)","Traditional Programming","Manual Data Entry"],"correctIndex":1,"explanation":"Correct! AI focuses on simulating human intelligence in machines."}'::jsonb,
  5
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  'abcdef01-3456-49ab-9ef0-23456789abcd',
  'f18b4e92-76dc-40ab-96f1-285b7396c003',
  'single',
  'Question',
  1,
  '{"options":["Web Development","Cloud Computing","Artificial Intelligence (AI)","Hardware Engineering"],"correctIndex":2,"explanation":"Correct! ML is a specialized subset of AI focused on learning from data."}'::jsonb,
  6
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  'bcdef012-4567-4abc-af01-3456789abcde',
  'f18b4e92-76dc-40ab-96f1-285b7396c003',
  'single',
  'Question',
  1,
  '{"options":["Natural Language Processing","Data Transformation","Anomaly Detection","Regression Analysis"],"correctIndex":2,"explanation":"Correct! Anomaly detection is used to spot unusual patterns or deviations."}'::jsonb,
  7
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  'cdef0123-5678-4bcd-b012-456789abcdef',
  'f18b4e92-76dc-40ab-96f1-285b7396c003',
  'single',
  'Question',
  1,
  '{"options":["Natural Language Processing (NLP)","Clustering","Data Granularity","Feature Selection"],"correctIndex":0,"explanation":"Correct! NLP allows machines to interpret unstructured text and speech."}'::jsonb,
  8
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  'def01234-6789-4cde-8123-56789abcdef0',
  'f18b4e92-76dc-40ab-96f1-285b7396c003',
  'single',
  'Question',
  1,
  '{"options":["Regression","Clustering","Classification","Normalization"],"correctIndex":2,"explanation":"Correct! Classification assigns data points to predefined categories."}'::jsonb,
  9
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  'ef012345-789a-4def-9234-6789abcdef01',
  'f18b4e92-76dc-40ab-96f1-285b7396c003',
  'single',
  'Question',
  1,
  '{"options":["A Database","An Algorithm","A Spreadsheet","Hardware"],"correctIndex":1,"explanation":"Correct! Algorithms provide the step-by-step logic for data processing."}'::jsonb,
  10
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '6789abcd-f012-4567-9abc-ef0123456789',
  'f18b4e92-76dc-40ab-96f1-285b7396c003',
  'single',
  'Question',
  1,
  '{"options":["Clustering","Data Mining","Regression","Feature Selection"],"correctIndex":2,"explanation":"Correct! Regression models predict continuous values based on historical data."}'::jsonb,
  11
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '56789abc-ef01-4456-89ab-def012345678',
  'f18b4e92-76dc-40ab-96f1-285b7396c003',
  'single',
  'Question',
  1,
  '{"options":["Anomaly Detection","Predictive Modeling","Data Cleaning","Univariate Analysis"],"correctIndex":1,"explanation":"Correct! Predictive modeling builds models to forecast future trends or events."}'::jsonb,
  12
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '6789abcd-f012-4567-9abc-ef0123456789',
  'f18b4e92-76dc-40ab-96f1-285b7396c004',
  'single',
  'Which chart type is best suited for showing trends over continuous time?',
  1,
  '{"options":["Column Chart","Line Chart","Pie Chart","Scatter Plot"],"correctIndex":1,"explanation":"Line charts connect continuous data points over time, making them the ideal choice for showing trends and rate of change."}'::jsonb,
  1
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '789abcde-0123-4678-abcd-f0123456789a',
  'f18b4e92-76dc-40ab-96f1-285b7396c004',
  'single',
  'What is the primary purpose of a Scatter Plot?',
  1,
  '{"options":["Show part-to-whole relationships","Show correlation or relationship between two numerical variables","Show rankings of categories","Show chronological trends"],"correctIndex":1,"explanation":"Scatter plots plot points on X and Y axes to identify relationships, correlations, and outliers between two numerical variables."}'::jsonb,
  2
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '89abcdef-1234-4789-bcde-0123456789ab',
  'f18b4e92-76dc-40ab-96f1-285b7396c004',
  'single',
  'Under which condition is a horizontal Bar Chart preferred over a vertical Column Chart?',
  1,
  '{"options":["When category labels are long and need horizontal reading space","When there are very few categories","When showing cumulative totals","When values are negative"],"correctIndex":0,"explanation":"Horizontal bar charts give ample horizontal space for category labels, making long names much easier to read without vertical tilting."}'::jsonb,
  3
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '9abcdef0-2345-489a-8def-123456789abc',
  'f18b4e92-76dc-40ab-96f1-285b7396c004',
  'single',
  'What type of chart is ideal for showing step-by-step conversion rates and drop-offs in a business process?',
  1,
  '{"options":["Waterfall Chart","Sankey Diagram","Funnel Chart","Area Chart"],"correctIndex":2,"explanation":"Funnel charts represent stages in a sequential process where values decrease at each stage, making it simple to visualize conversion and drop-off points."}'::jsonb,
  4
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  'abcdef01-3456-49ab-9ef0-23456789abcd',
  'f18b4e92-76dc-40ab-96f1-285b7396c004',
  'single',
  'Which chart shows how positive and negative incremental values lead to a final total?',
  1,
  '{"options":["Area Chart","Waterfall Chart","Ribbon Chart","Donut Chart"],"correctIndex":1,"explanation":"Waterfall charts show the cumulative effect of positive and negative values from an initial starting value to a final resulting value."}'::jsonb,
  5
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  'bcdef012-4567-4abc-af01-3456789abcde',
  'f18b4e92-76dc-40ab-96f1-285b7396c004',
  'single',
  'A Donut Chart is a variation of which chart type?',
  1,
  '{"options":["Pie Chart","Bar Chart","Treemap","Sankey Diagram"],"correctIndex":0,"explanation":"A donut chart is functionally identical to a pie chart, but has a hollow center which can be used to display summary labels or totals."}'::jsonb,
  6
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  'cdef0123-5678-4bcd-b012-456789abcdef',
  'f18b4e92-76dc-40ab-96f1-285b7396c004',
  'single',
  'What does the width of the lines in a Sankey Diagram represent?',
  1,
  '{"options":["The data category","The rate of change over time","The proportional quantity or flow volume","The specific time period"],"correctIndex":2,"explanation":"In Sankey diagrams, the thickness/width of the connecting paths is directly proportional to the flow quantity between nodes."}'::jsonb,
  7
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  'def01234-6789-4cde-8123-56789abcdef0',
  'f18b4e92-76dc-40ab-96f1-285b7396c004',
  'single',
  'Which chart displays hierarchical data as a set of nested rectangles?',
  1,
  '{"options":["Funnel Chart","Treemap","Area Chart","Column Chart"],"correctIndex":1,"explanation":"Treemaps display hierarchical tree-structured data as a set of nested rectangles, where each branch/leaf size represents its numerical value."}'::jsonb,
  8
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '789abcde-0123-4678-abcd-f0123456789a',
  'f18b4e92-76dc-40ab-96f1-285b7396c005',
  'single',
  'Which data privacy regulation specifically applies to the protection of health information in the United States?',
  1,
  '{"options":["CHECK ANSWER"],"correctIndex":2,"explanation":"Correct! HIPAA specifically protects sensitive patient health information in the U.S."}'::jsonb,
  1
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '89abcdef-1234-4789-bcde-0123456789ab',
  'f18b4e92-76dc-40ab-96f1-285b7396c005',
  'single',
  'What is the core principle of "Data Minimization" in privacy best practices?',
  1,
  '{"options":["CHECK ANSWER"],"correctIndex":1,"explanation":"Correct! Data Minimization means you should only collect and process data that is absolutely necessary for the specific purpose."}'::jsonb,
  2
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '9abcdef0-2345-489a-8def-123456789abc',
  'f18b4e92-76dc-40ab-96f1-285b7396c005',
  'single',
  'If an organization uses "Role-Based Access Control (RBAC)", which privacy best practice are they primarily enforcing?',
  1,
  '{"options":["CHECK ANSWER"],"correctIndex":3,"explanation":"Correct! RBAC is a method of restricting network access based on the roles of individual users within an enterprise, enforcing Strong Access Control."}'::jsonb,
  3
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  'abcdef01-3456-49ab-9ef0-23456789abcd',
  'f18b4e92-76dc-40ab-96f1-285b7396c005',
  'single',
  'Which practice ensures that data cannot be easily traced back to an individual during analysis?',
  1,
  '{"options":["CHECK ANSWER"],"correctIndex":0,"explanation":"Correct! Anonymization and Pseudonymization modify or remove personal identifiers to protect individual identities."}'::jsonb,
  4
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  'bcdef012-4567-4abc-af01-3456789abcde',
  'f18b4e92-76dc-40ab-96f1-285b7396c005',
  'single',
  'Under regulations like the GDPR, what must organizations generally do before collecting personal data?',
  1,
  '{"options":["CHECK ANSWER"],"correctIndex":1,"explanation":"Correct! Obtaining explicit consent and being transparent about how data will be used are fundamental requirements of GDPR and similar privacy laws."}'::jsonb,
  5
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  'ef012345-789a-4def-9234-6789abcdef01',
  'f18b4e92-76dc-40ab-96f1-285b7396d001',
  'single',
  'Which of the following scenarios best illustrates the difference between data and information?',
  1,
  '{"options":["A list of temperatures is information, while a chart showing them is data.","Random numbers are data, while knowing these represent daily sales is information.","A printed textbook is data, while a digital ebook is information.","Data is always numbers, while information is always words."],"correctIndex":1,"explanation":"Processing raw numbers into daily sales adds the necessary context, successfully turning meaningless data into actionable information."}'::jsonb,
  1
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  'f0123456-89ab-4ef0-a345-789abcdef012',
  'f18b4e92-76dc-40ab-96f1-285b7396d001',
  'truefalse',
  'Information is the highest level of the hierarchy and represents the final stage of understanding.',
  1,
  '{"correct":false,"explanation":"Based on module concepts."}'::jsonb,
  2
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '01234567-9abc-4f01-b456-89abcdef0123',
  'f18b4e92-76dc-40ab-96f1-285b7396d001',
  'single',
  'If you are recording the exact temperature in degrees Celsius (e.g., 23.5), which data type must you use to maintain accuracy?',
  1,
  '{"options":["Integer","Float","Boolean","Complex"],"correctIndex":1,"explanation":"Floats are used for numbers with fractional or decimal parts, which is necessary for precise measurements like 23.5."}'::jsonb,
  3
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '12345678-abcd-4012-8567-9abcdef01234',
  'f18b4e92-76dc-40ab-96f1-285b7396d001',
  'single',
  'In Excel, if you enter a whole number into a cell, what data type is it automatically treated as?',
  1,
  '{"options":["Float","String","Integer","Boolean"],"correctIndex":2,"explanation":"Excel natively treats whole numbers (numbers without decimal points) as integers."}'::jsonb,
  4
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '23456789-bcde-4123-9678-abcdef012345',
  'f18b4e92-76dc-40ab-96f1-285b7396d001',
  'single',
  'How are elements typically represented in a Dictionary?',
  1,
  '{"options":["index: value","key: value","row: column","value only"],"correctIndex":1,"explanation":"Dictionaries store data in pairs: a unique Key and its associated Value, making it easy to retrieve data using labels."}'::jsonb,
  5
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '3456789a-cdef-4234-a789-bcdef0123456',
  'f18b4e92-76dc-40ab-96f1-285b7396d001',
  'single',
  'Which of the following is considered "Unstructured Data"?',
  1,
  '{"options":["A SQL database table with rows and columns","A social media post containing text and an image","An Excel spreadsheet of monthly expenses","A bank statement in CSV format"],"correctIndex":1,"explanation":"Social media posts, emails, and images are unstructured because they do not fit into a fixed row-and-column format."}'::jsonb,
  6
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '456789ab-def0-4345-b89a-cdef01234567',
  'f18b4e92-76dc-40ab-96f1-285b7396d001',
  'single',
  'In the ''Extract'' stage of ETL, what is a common challenge when dealing with multiple source systems like CRM, ERP, and legacy flat files?',
  1,
  '{"options":["Data must be converted to Python code immediately","Source systems may have different data formats and structures that need consolidation","Extraction always deletes the data from the source system to save space","Only cloud-based data can be extracted using ETL tools"],"correctIndex":1,"explanation":"Correct! Extraction involves retrieving data from various, often disparate source systems, which is the first step toward creating a unified dataset."}'::jsonb,
  7
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '56789abc-ef01-4456-89ab-def012345678',
  'f18b4e92-76dc-40ab-96f1-285b7396d001',
  'single',
  'In which library in Python is commonly used with Regular Expressions (Regex) to find and replace special characters in a string?',
  1,
  '{"options":["math","pandas","re","json"],"correctIndex":2,"explanation":"The re module in Python provides support for regular expressions, which are essential for identifying and removing unwanted characters."}'::jsonb,
  8
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '6789abcd-f012-4567-9abc-ef0123456789',
  'f18b4e92-76dc-40ab-96f1-285b7396d001',
  'single',
  'You have a report where ''Year'' is currently the row header and ''Region'' is the column header. You need to flip the report so ''Region'' becomes the rows and ''Year'' becomes the columns. Which operation should you use?',
  1,
  '{"options":["Filtering","Transposing","Merging"],"correctIndex":1,"explanation":"Correct! Transposing changes the orientation of the data, switching rows and columns."}'::jsonb,
  9
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '789abcde-0123-4678-abcd-f0123456789a',
  'f18b4e92-76dc-40ab-96f1-285b7396d001',
  'single',
  'You want to connect a ''Customer'' table with an ''Orders'' table. Both tables must share a specific piece of information to link the records correctly. what is this shared information called?',
  1,
  '{"options":["A Filter","A Relational Key (or Common ID)","A Summary Row"],"correctIndex":1,"explanation":"Correct! Merging requires a relational join key to connect disparate data sources accurately."}'::jsonb,
  10
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  'f0123456-89ab-4ef0-a345-789abcdef012',
  'f18b4e92-76dc-40ab-96f1-285b7396d001',
  'single',
  'Question',
  1,
  '{"options":["df.info()","df.head()","df.describe()","df.summarize()"],"correctIndex":2,"explanation":"Correct! .describe() is the standard method for summary statistics in Pandas."}'::jsonb,
  11
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  'ef012345-789a-4def-9234-6789abcdef01',
  'f18b4e92-76dc-40ab-96f1-285b7396d001',
  'single',
  'Question',
  1,
  '{"options":["Predictive Analytics","Exploratory Data Analysis (EDA)","Prescriptive Analytics","Diagnostic Analytics"],"correctIndex":1,"explanation":"Correct! EDA is the crucial initial phase where you summarize data characteristics and spot anomalies."}'::jsonb,
  12
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  'def01234-6789-4cde-8123-56789abcdef0',
  'f18b4e92-76dc-40ab-96f1-285b7396d001',
  'single',
  'Question',
  1,
  '{"options":["To investigate granular details and identify the root cause of specific data errors or outliers.","To automatically delete all duplicate records.","To summarize data into higher-level categories only.","To change the underlying structure of the database."],"correctIndex":0,"explanation":"Correct! Drilling down allows analysts to pinpoint where inconsistencies or outliers are originating."}'::jsonb,
  13
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  'cdef0123-5678-4bcd-b012-456789abcdef',
  'f18b4e92-76dc-40ab-96f1-285b7396d001',
  'single',
  'Question',
  1,
  '{"options":["Natural Language Processing","Data Transformation","Anomaly Detection","Regression Analysis"],"correctIndex":2,"explanation":"Correct! Anomaly detection is used to spot unusual patterns or deviations."}'::jsonb,
  14
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  'bcdef012-4567-4abc-af01-3456789abcde',
  'f18b4e92-76dc-40ab-96f1-285b7396d001',
  'single',
  'Question',
  1,
  '{"options":["A Database","An Algorithm","A Spreadsheet","Hardware"],"correctIndex":1,"explanation":"Correct! Algorithms provide the step-by-step logic for data processing."}'::jsonb,
  15
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  'abcdef01-3456-49ab-9ef0-23456789abcd',
  'f18b4e92-76dc-40ab-96f1-285b7396d001',
  'single',
  'Which chart type is best suited for showing trends over continuous time?',
  1,
  '{"options":["Column Chart","Line Chart","Pie Chart","Scatter Plot"],"correctIndex":1,"explanation":"Line charts connect continuous data points over time, making them the ideal choice for showing trends and rate of change."}'::jsonb,
  16
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '9abcdef0-2345-489a-8def-123456789abc',
  'f18b4e92-76dc-40ab-96f1-285b7396d001',
  'single',
  'What type of chart is ideal for showing step-by-step conversion rates and drop-offs in a business process?',
  1,
  '{"options":["Waterfall Chart","Sankey Diagram","Funnel Chart","Area Chart"],"correctIndex":2,"explanation":"Funnel charts represent stages in a sequential process where values decrease at each stage, making it simple to visualize conversion and drop-off points."}'::jsonb,
  17
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '89abcdef-1234-4789-bcde-0123456789ab',
  'f18b4e92-76dc-40ab-96f1-285b7396d001',
  'single',
  'What does the width of the lines in a Sankey Diagram represent?',
  1,
  '{"options":["The data category","The rate of change over time","The proportional quantity or flow volume","The specific time period"],"correctIndex":2,"explanation":"In Sankey diagrams, the thickness/width of the connecting paths is directly proportional to the flow quantity between nodes."}'::jsonb,
  18
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '789abcde-0123-4678-abcd-f0123456789a',
  'f18b4e92-76dc-40ab-96f1-285b7396d001',
  'single',
  'What is the core principle of "Data Minimization" in privacy best practices?',
  1,
  '{"options":["CHECK ANSWER"],"correctIndex":1,"explanation":"Correct! Data Minimization means you should only collect and process data that is absolutely necessary for the specific purpose."}'::jsonb,
  19
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '6789abcd-f012-4567-9abc-ef0123456789',
  'f18b4e92-76dc-40ab-96f1-285b7396d001',
  'single',
  'Under regulations like the GDPR, what must organizations generally do before collecting personal data?',
  1,
  '{"options":["CHECK ANSWER"],"correctIndex":1,"explanation":"Correct! Obtaining explicit consent and being transparent about how data will be used are fundamental requirements of GDPR and similar privacy laws."}'::jsonb,
  20
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  'f0123456-89ab-4ef0-a345-789abcdef012',
  'f18b4e92-76dc-40ab-96f1-285b7396d002',
  'single',
  'Which level of the hierarchy is characterized by being ''action-oriented'' and built through experience and reflection?',
  1,
  '{"options":["Metadata","Information","Knowledge","Data"],"correctIndex":2,"explanation":"Knowledge represents the application of information to make decisions and solve problems based on experience."}'::jsonb,
  1
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '01234567-9abc-4f01-b456-89abcdef0123',
  'f18b4e92-76dc-40ab-96f1-285b7396d002',
  'truefalse',
  'Summarizing a large spreadsheet of sales figures into a monthly growth chart is an example of creating knowledge.',
  1,
  '{"correct":false,"explanation":"Based on module concepts."}'::jsonb,
  2
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '12345678-abcd-4012-8567-9abcdef01234',
  'f18b4e92-76dc-40ab-96f1-285b7396d002',
  'single',
  'Which of the following is the best example of a String data type?',
  1,
  '{"options":["3.14159","\"Hello World\"","True","42"],"correctIndex":1,"explanation":"Strings are sequences of characters enclosed in quotes, used to represent text."}'::jsonb,
  3
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '23456789-bcde-4123-9678-abcdef012345',
  'f18b4e92-76dc-40ab-96f1-285b7396d002',
  'single',
  'Which data structure is "locked" or immutable, meaning its elements cannot be changed after creation?',
  1,
  '{"options":["List","Tuple","Dictionary","Set"],"correctIndex":1,"explanation":"A Tuple is immutable (locked), making it safer for data that should stay constant like GPS coordinates."}'::jsonb,
  4
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '3456789a-cdef-4234-a789-bcdef0123456',
  'f18b4e92-76dc-40ab-96f1-285b7396d002',
  'single',
  'Which brackets are used to define a List in Python?',
  1,
  '{"options":["Parentheses ( )","Curly Braces { }","Square Brackets [ ]","Angle Brackets < >"],"correctIndex":2,"explanation":"Lists are always defined using Square Brackets [ ] in Python."}'::jsonb,
  5
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '456789ab-def0-4345-b89a-cdef01234567',
  'f18b4e92-76dc-40ab-96f1-285b7396d002',
  'single',
  'Metadata is best defined as:',
  1,
  '{"options":["Data that has been deleted from a system","\"Data about data\" that describes its characteristics","Encrypted data used for security purposes","Large datasets that require supercomputers to process"],"correctIndex":1,"explanation":"Metadata provides context like creation date, dimensions, and file type, effectively acting as data about data."}'::jsonb,
  6
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '56789abc-ef01-4456-89ab-def012345678',
  'f18b4e92-76dc-40ab-96f1-285b7396d002',
  'single',
  'Which loading strategy involves adding only the records that have been created or changed since the last execution to the data warehouse?',
  1,
  '{"options":["Full Load","Initial Load","Incremental Load","Static Load"],"correctIndex":2,"explanation":"Correct! Incremental Load is efficient because it only processes updates, rather than re-importing the entire dataset every time."}'::jsonb,
  7
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '6789abcd-f012-4567-9abc-ef0123456789',
  'f18b4e92-76dc-40ab-96f1-285b7396d002',
  'single',
  'Which string method in Python is used to remove both leading and trailing white spaces from a text variable?',
  1,
  '{"options":[".remove()",".strip()",".clean()",".trim()"],"correctIndex":1,"explanation":"The .strip() method removes any leading (beginning) and trailing (end) whitespace characters from a string."}'::jsonb,
  8
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '789abcde-0123-4678-abcd-f0123456789a',
  'f18b4e92-76dc-40ab-96f1-285b7396d002',
  'single',
  'At the end of each day, you add new sales records to the bottom of your master ''Sales_History'' file. This process of adding new rows to an existing dataset is known as:',
  1,
  '{"options":["Appending","Merging","Slicing"],"correctIndex":0,"explanation":"Correct! Appending adds new data points vertically to the end of an existing dataset."}'::jsonb,
  9
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '89abcdef-1234-4789-bcde-0123456789ab',
  'f18b4e92-76dc-40ab-96f1-285b7396d002',
  'single',
  'Question',
  1,
  '{"options":["COUNT","SUM","AVG","MAX"],"correctIndex":1,"explanation":"Correct! SUM calculates the total numerical value within each group."}'::jsonb,
  10
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '01234567-9abc-4f01-b456-89abcdef0123',
  'f18b4e92-76dc-40ab-96f1-285b7396d002',
  'single',
  'Question',
  1,
  '{"options":["SUM","COUNT","AVG","MIN"],"correctIndex":1,"explanation":"Correct! COUNT determines the distribution of items (rows) in each group."}'::jsonb,
  11
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  'f0123456-89ab-4ef0-a345-789abcdef012',
  'f18b4e92-76dc-40ab-96f1-285b7396d002',
  'single',
  'Question',
  1,
  '{"options":["Descriptive Analytics","Diagnostic Analytics","Predictive Analytics","Prescriptive Analytics"],"correctIndex":1,"explanation":"Correct! Diagnostic analytics focuses on determining why something happened by identifying root causes."}'::jsonb,
  12
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  'ef012345-789a-4def-9234-6789abcdef01',
  'f18b4e92-76dc-40ab-96f1-285b7396d002',
  'single',
  'Question',
  1,
  '{"options":["Data Warehousing","Artificial Intelligence (AI)","Traditional Programming","Manual Data Entry"],"correctIndex":1,"explanation":"Correct! AI focuses on simulating human intelligence in machines."}'::jsonb,
  13
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  'def01234-6789-4cde-8123-56789abcdef0',
  'f18b4e92-76dc-40ab-96f1-285b7396d002',
  'single',
  'Question',
  1,
  '{"options":["Natural Language Processing (NLP)","Clustering","Data Granularity","Feature Selection"],"correctIndex":0,"explanation":"Correct! NLP allows machines to interpret unstructured text and speech."}'::jsonb,
  14
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  'cdef0123-5678-4bcd-b012-456789abcdef',
  'f18b4e92-76dc-40ab-96f1-285b7396d002',
  'single',
  'Question',
  1,
  '{"options":["Clustering","Data Mining","Regression","Feature Selection"],"correctIndex":2,"explanation":"Correct! Regression models predict continuous values based on historical data."}'::jsonb,
  15
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  'bcdef012-4567-4abc-af01-3456789abcde',
  'f18b4e92-76dc-40ab-96f1-285b7396d002',
  'single',
  'What is the primary purpose of a Scatter Plot?',
  1,
  '{"options":["Show part-to-whole relationships","Show correlation or relationship between two numerical variables","Show rankings of categories","Show chronological trends"],"correctIndex":1,"explanation":"Scatter plots plot points on X and Y axes to identify relationships, correlations, and outliers between two numerical variables."}'::jsonb,
  16
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  'abcdef01-3456-49ab-9ef0-23456789abcd',
  'f18b4e92-76dc-40ab-96f1-285b7396d002',
  'single',
  'Which chart shows how positive and negative incremental values lead to a final total?',
  1,
  '{"options":["Area Chart","Waterfall Chart","Ribbon Chart","Donut Chart"],"correctIndex":1,"explanation":"Waterfall charts show the cumulative effect of positive and negative values from an initial starting value to a final resulting value."}'::jsonb,
  17
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '9abcdef0-2345-489a-8def-123456789abc',
  'f18b4e92-76dc-40ab-96f1-285b7396d002',
  'single',
  'Which chart displays hierarchical data as a set of nested rectangles?',
  1,
  '{"options":["Funnel Chart","Treemap","Area Chart","Column Chart"],"correctIndex":1,"explanation":"Treemaps display hierarchical tree-structured data as a set of nested rectangles, where each branch/leaf size represents its numerical value."}'::jsonb,
  18
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '89abcdef-1234-4789-bcde-0123456789ab',
  'f18b4e92-76dc-40ab-96f1-285b7396d002',
  'single',
  'If an organization uses "Role-Based Access Control (RBAC)", which privacy best practice are they primarily enforcing?',
  1,
  '{"options":["CHECK ANSWER"],"correctIndex":3,"explanation":"Correct! RBAC is a method of restricting network access based on the roles of individual users within an enterprise, enforcing Strong Access Control."}'::jsonb,
  19
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '01234567-9abc-4f01-b456-89abcdef0123',
  'f18b4e92-76dc-40ab-96f1-285b7396d003',
  'truefalse',
  'Raw data is often meaningless on its own because it lacks context and organization.',
  1,
  '{"correct":true,"explanation":"Based on module concepts."}'::jsonb,
  1
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '12345678-abcd-4012-8567-9abcdef01234',
  'f18b4e92-76dc-40ab-96f1-285b7396d003',
  'single',
  'Which data type is most appropriate for a variable that tracks whether a customer is a premium subscriber or not?',
  1,
  '{"options":["String","Float","Boolean","Integer"],"correctIndex":2,"explanation":"A Boolean data type is perfect for this as it represents a logical state with only two possible values: True (Premium) or False (Not Premium)."}'::jsonb,
  2
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '23456789-bcde-4123-9678-abcdef012345',
  'f18b4e92-76dc-40ab-96f1-285b7396d003',
  'single',
  'In the complex number expression a + bi, what does the i represent?',
  1,
  '{"options":["An integer variable","The real part","The imaginary unit","A floating-point number"],"correctIndex":2,"explanation":"The i represents the imaginary unit, which has the unique mathematical property where i&sup2; = -1."}'::jsonb,
  3
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '3456789a-cdef-4234-a789-bcdef0123456',
  'f18b4e92-76dc-40ab-96f1-285b7396d003',
  'single',
  'Which data structure automatically removes any duplicate items you try to add?',
  1,
  '{"options":["List","Tuple","Set","Table"],"correctIndex":2,"explanation":"A Set acts like a bag of unique items and does not allow duplicate values."}'::jsonb,
  4
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '456789ab-def0-4345-b89a-cdef01234567',
  'f18b4e92-76dc-40ab-96f1-285b7396d003',
  'single',
  'Which brackets are used to define both Sets and Dictionaries?',
  1,
  '{"options":["Square Brackets [ ]","Curly Braces { }","Parentheses ( )","Double Quotes \" \""],"correctIndex":1,"explanation":"Both Sets and Dictionaries use Curly Braces { }, but Dictionaries use key:value pairs inside."}'::jsonb,
  5
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '56789abc-ef01-4456-89ab-def012345678',
  'f18b4e92-76dc-40ab-96f1-285b7396d003',
  'single',
  'What is a primary characteristic of "Raw Data"?',
  1,
  '{"options":["It is already cleaned and ready for final analysis","It takes up very little storage space","It is unprocessed and full of \"noise\" (errors or duplicates)","It has been interpreted by humans to remove bias"],"correctIndex":2,"explanation":"Raw data is the initial collection of facts before any filtering or cleaning has occurred, often containing redundant or erroneous information."}'::jsonb,
  6
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '6789abcd-f012-4567-9abc-ef0123456789',
  'f18b4e92-76dc-40ab-96f1-285b7396d003',
  'single',
  'When a dataset has a column with many outliers (extreme values), which imputation method is generally preferred to fill missing values?',
  1,
  '{"options":["Mean Imputation","Median Imputation","Zero Imputation","Drop the column"],"correctIndex":1,"explanation":"Median imputation is more robust to outliers than mean imputation, as it uses the middle value which is less affected by extreme scores."}'::jsonb,
  7
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '789abcde-0123-4678-abcd-f0123456789a',
  'f18b4e92-76dc-40ab-96f1-285b7396d003',
  'single',
  'You need to organize a list of employee names in reverse alphabetical order (Z to A). Which sorting method is required?',
  1,
  '{"options":["Ascending Order","Descending Order","Random Sorting"],"correctIndex":1,"explanation":"Correct! Descending order (Z-A or 10-1) is used for reverse alphabetical arrangement."}'::jsonb,
  8
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '89abcdef-1234-4789-bcde-0123456789ab',
  'f18b4e92-76dc-40ab-96f1-285b7396d003',
  'single',
  'You are working with a massive dataset of 5 million records. To test your logic quickly, you decide to only use the top 100 rows. what is this technique called?',
  1,
  '{"options":["Transposing","Truncating","Sorting"],"correctIndex":1,"explanation":"Correct! Truncating reduces the dataset to a specific length for better performance and testing."}'::jsonb,
  9
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '9abcdef0-2345-489a-8def-123456789abc',
  'f18b4e92-76dc-40ab-96f1-285b7396d003',
  'single',
  'Question',
  1,
  '{"options":["It expands the data horizontally by adding more columns.","It hides columns that contain categorical data.","It collapses many rows into a few key \"bottom-line\" numbers.","It sorts the data in descending order automatically."],"correctIndex":2,"explanation":"Correct! Summarizing collapses data vertically to give an overview."}'::jsonb,
  10
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '12345678-abcd-4012-8567-9abcdef01234',
  'f18b4e92-76dc-40ab-96f1-285b7396d003',
  'single',
  'Question',
  1,
  '{"options":["Delete duplicate rows from the dataset.","Reshape data by converting rows into columns for structured reports.","Sort data based on alphabetical order.","Fill in missing values with the mean of the column."],"correctIndex":1,"explanation":"Correct! Pivoting reorganizes data to view it from a different perspective."}'::jsonb,
  11
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '01234567-9abc-4f01-b456-89abcdef0123',
  'f18b4e92-76dc-40ab-96f1-285b7396d003',
  'single',
  'Question',
  1,
  '{"options":["Aggregation","Disaggregation (Drill-Down)","Data Cleaning","Predictive Modeling"],"correctIndex":1,"explanation":"Correct! Drilling down involves disaggregating data to see more granular levels."}'::jsonb,
  12
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  'f0123456-89ab-4ef0-a345-789abcdef012',
  'f18b4e92-76dc-40ab-96f1-285b7396d003',
  'single',
  'Question',
  1,
  '{"options":["Web Development","Cloud Computing","Artificial Intelligence (AI)","Hardware Engineering"],"correctIndex":2,"explanation":"Correct! ML is a specialized subset of AI focused on learning from data."}'::jsonb,
  13
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  'ef012345-789a-4def-9234-6789abcdef01',
  'f18b4e92-76dc-40ab-96f1-285b7396d003',
  'single',
  'Question',
  1,
  '{"options":["Regression","Clustering","Classification","Normalization"],"correctIndex":2,"explanation":"Correct! Classification assigns data points to predefined categories."}'::jsonb,
  14
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  'def01234-6789-4cde-8123-56789abcdef0',
  'f18b4e92-76dc-40ab-96f1-285b7396d003',
  'single',
  'Question',
  1,
  '{"options":["Anomaly Detection","Predictive Modeling","Data Cleaning","Univariate Analysis"],"correctIndex":1,"explanation":"Correct! Predictive modeling builds models to forecast future trends or events."}'::jsonb,
  15
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  'cdef0123-5678-4bcd-b012-456789abcdef',
  'f18b4e92-76dc-40ab-96f1-285b7396d003',
  'single',
  'Under which condition is a horizontal Bar Chart preferred over a vertical Column Chart?',
  1,
  '{"options":["When category labels are long and need horizontal reading space","When there are very few categories","When showing cumulative totals","When values are negative"],"correctIndex":0,"explanation":"Horizontal bar charts give ample horizontal space for category labels, making long names much easier to read without vertical tilting."}'::jsonb,
  16
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  'bcdef012-4567-4abc-af01-3456789abcde',
  'f18b4e92-76dc-40ab-96f1-285b7396d003',
  'single',
  'A Donut Chart is a variation of which chart type?',
  1,
  '{"options":["Pie Chart","Bar Chart","Treemap","Sankey Diagram"],"correctIndex":0,"explanation":"A donut chart is functionally identical to a pie chart, but has a hollow center which can be used to display summary labels or totals."}'::jsonb,
  17
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  'abcdef01-3456-49ab-9ef0-23456789abcd',
  'f18b4e92-76dc-40ab-96f1-285b7396d003',
  'single',
  'Which data privacy regulation specifically applies to the protection of health information in the United States?',
  1,
  '{"options":["CHECK ANSWER"],"correctIndex":2,"explanation":"Correct! HIPAA specifically protects sensitive patient health information in the U.S."}'::jsonb,
  18
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
INSERT INTO public.questions (id, test_id, type, stem, marks, config, display_order)
VALUES (
  '9abcdef0-2345-489a-8def-123456789abc',
  'f18b4e92-76dc-40ab-96f1-285b7396d003',
  'single',
  'Which practice ensures that data cannot be easily traced back to an individual during analysis?',
  1,
  '{"options":["CHECK ANSWER"],"correctIndex":0,"explanation":"Correct! Anonymization and Pseudonymization modify or remove personal identifiers to protect individual identities."}'::jsonb,
  19
) ON CONFLICT (id) DO UPDATE SET type = EXCLUDED.type, stem = EXCLUDED.stem, marks = EXCLUDED.marks, config = EXCLUDED.config, display_order = EXCLUDED.display_order;
