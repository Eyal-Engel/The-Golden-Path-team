## שלב 1 – לוגיקה עסקית

4. על מנת שנוכל לוודא כי המוצר שבנינו מוסר ללקוח תשובות נכונות, ביצענו בדיקות(טסטים) על מגוון קלטים שונים, ולאחר שצצו באגים במקרים מסויימים, תיקנו אותם. מקרי הקצה שעלולים לצוץ בעת שימוש במערכת הם:

   - כאשר V = 0, המהירות האופקית תהיה שווה ל-0 והמהירות האנכית של הטיל תהיה מושפעת מ g בלבד – זהו מקרה של נפילה חופשית – לא תנועה בליסטית!

   - כאשר h0 = 0 ו V = 0, הזבובון במקרה זה אינו יבצע תנועה.

   - כאשר initialAngle = 0, כשזווית הירייה שווה ל 0 - המהירות האנכית של הטיל תהיה מושפעת מ g בלבד – זהו מקרה של נפילה חופשית – לא תנועה בליסטית!

   - כאשר initialAngle = 90, כשזווית הירייה שווה ל 90 – הזבובון יעלה לנקודה מסויימת באוויר(max height) ולאחר מכן יבצע תנועה של נפילה חופשית – לא תנועה בליסטית!

5. נוכל לשפר את המודל ע"י כך שנתייחס לגורמים הנוספים הסביבה כגון: רוח, השפעת החיכוך של הטיל עם האוויר, חיכוך הטיל עם המתקן עימו משגרים את הטיל.

   תנאי הסביבה של המציאות שניתן לדעתי לממש במודל הם: רוח, חיכוך של הטיל עם האוויר, חיכוך הטיל עם המתקן עימו משגרים את הטיל.

## שלב 2 – ארכיטקטורה

4. כאשר תתקבל בקשה מהלקוח לשרת, השרת ינהל את הבקשה – יבצע את החישובים הנצרכים – ויחזיר את התשובה בהתאם ללקוח (בונוס: השרת יחזיר בנוסף 2 מערכים המאפיינים את מיקומי הזבובון במהלך תנועתו (X ו Y) ולאחר מכן נשתמש ב chart.js על מנת לבנות את הגרף למשתמש ולהציגו במסך). במידה ויש עומס של בקשות על אותו שרת, k8s יעלה לאוויר שרת נוסף, שייבצע חלוקת עומסים בין השרתים, במידה ויש עוד עומס (מאשר 2 שרתים עמוסים) יעלה עוד שרתים, ובמידה ויש פחות עומס – יוריד את כמו השרתים, כדי לחסוך במשאבים.
5. השרת יחזיר ללקוח הודעת שגיאה על הזנת נתונים בלתי תקינים. http response code + msg
   401, ונציג למשתמש במסך הודעת שגיאה.
6. נוכל להגן על הנתונים הזורמים במהלך התקשורת על ידי שימוש בפרוטוקול התקשורת HTTPS.
   פרוטוקול זה אינו פרוטוקול לכשעצמו, אלא שפרוטוקול זה משתמש בפרוטוקול HTTPS על שכבת
   SSL /TLS, וכך למעשה התקשורת מוצפנת. פרוטוקולים SSL/TLS הינם פרוטוקולי אבטחה כך
   ששילובם עם פרוטוקול HTTP יוצר לנו פרוטוקול מאובטח. בנוסף נוכל להצפין את התעבורה על ידי
   שימוש בהצפנת AES (סימטרית – בעלת מפתח זהה למצפין ולמפענח) בעלת מפתח באורכים
   הבאים: 128/192/256 ביט .
7. ניתן לייעל את המערכת על ידי שימוש בזכרון מטמון(.(caching אנו משתמשים בשמירה במטמון על מנת לאחסן מידע שנדרש לעתים קרובות מהמשתמשים, ועל ידי כך אנו מגדילים את מהירות הגלישה וקבלת המענה לבקשת הלקוח. עם זאת כמות הזכרון שניתן להכניס בזכרון מטמון מוגבל מאוד. באפליקציה שלנו, אנו נבדוק ראשית האם החישוב אותו מבקש הלקוח נמצא ב cache אם כן, נחזיר את תוצאות החישוב משם, אחרת השרת יקבל את הבקשה שצריך לחשב – יבצע את החישובים הנצרכים – ויחזיר תשובה בהתאם.
8. נבצע חלוקת עומסים בין השרתים על ידי שימוש ב k8s: אשר יעלה יותר שרתים לאוויר שינהלו את העומסים, מאשר שיהיו מספר לקוחות נוספים הממתינים לתשובה מהשרת/ שהבקשה שלהם תגיע לשרת. בנוסף, שרת on-perm מוגבל מאוד תשתיתית, שרת מסוג זה נמצא בחצרים של אדם פרטי או הארגון כך שכמות התשתיות שניתן לספק משרת מסוג זה מאוד מוגבלת. לכן, כדאי להשתמש במחשוב ענן (Cloud Computing) שיודע לנהל את המשאבים בהדרגתיות ((scale . Scalability(מדרגיות) למעשה, מייצגת לנו את מדד היכולת של המערכת להגדיל/להקטין בביצועים ובעלות התשתיות, בתגובה לדרישות היישום ועיבוד המערכת, לדוגמא להוסיף משאבים(לרוב חומריים) על מנת להגדיל את תפוקת היישון תחת עומס הולך וגובר.

ישנם שני סוגים בסיסיים במדרגיות במחשוב ענן:

1. קנה מידה אנכי – עם קנה מידה זה אנו מוסיפים/מפחיתים כוח לשרת ענן קיים זכרון(RAM),  
   אחסון (Storage) או כוח עיבוד (CPU).
2. קנה מידה אופקי – קנה מידה זה מתייחס להקצאת שרתים נוספים כדי להענות לצרכי המערכת,
   לעתים קרובות נשתמש בקנה מידה זה על מנת לפצל עומסי עבודה בין שרתים, ועל ידי כך נגביל
   את כמות הבקשות ששרת בודד מקבל.

## שלב 3 – אפליקציה

4. בעת פיתוח ממשק המשתמש נשים בראש מעיינו את נוחות ונגישות המערכת למשתמש. על מנת לספק חווית משתמש ברמה גבוהה נרצה שזמני ההמתנה יהיו שואפים ל-0, כך שהלקוח אינו ירגיש שהמערכת איטית בשבילו. במקרה שלנו האפליקציה הינה Single Page Application, ולכן איננו צריכים לעשות מעבר מסכים מהיר, אם זאת נרצה שזמן החישוב יהיה כמה שיותר נמוך, כך שהצגת התוצאות ללקוח תהיה המהירה ביותר.

השלב הבא אשר חשוב לו פחות, שילוב הצבעים וכמות האובייקטים במסך. על מנת ליצור שילוב צבעים אשר מתאים למסר שהאפליקציה רוצה להעביר ובנוסף לא תצרום לעיני המשתמש השתמשתי ב"תאוריית הצבעים של גתה".
בנוסף, Https נתפס יותר לתחום הרשתות, עם זאת, בעידן המודרני של היום הקהל הרחב מודע יותר ויותר פחות להיכנס לאתרים שאינם בעלי certificate ב chrome ושאינם https. באפליקציה שלנו, התקשורת מבוצעת ב Https, עם זאת עקב כך שלא הוגשה בקשה ל chrome טרם האפליקציה קיבלה certificate.

בנוסף, האתר צריך להיות מותאם לקהל היעד, לקהל מבוגר יותר – טקסט גדול יותר, כפתורים גדולים יותר, וכמובן בכל אתר שיהיה רספונסיבי.

5. פיתוח ממשק המשתמש יתחיל באפיון המסך – סקיצה ראשונית כיצד ייראה דף הנחיתה של האתר. בעת פיתוח ה backend/ צד שרת, נשתמש בטכנולוגיית Express על מנת להקים את השרת, בנוסף נשתמש בטכנולוגיית Node.js המספקת לנו כלי פיתוח נוספים כמו Nodemon אשר מקל רבות על פיתוח האפליקציה, כך שאין צורך לכבות ולהדליק את השרת, על מנת לראות עדכונים בזמן אמת בדף האפליקציה. על מנת לבצע בדיקות API השתמשנו בכלי Postmanאת התקשורת בין הלקוח לשרת נבצע בפרוטוקול Http ובנוסף נשתמש בספרייה OpenSSL , וכך הקננו יכולת אבטחה של סטנדרט SSL/TLS לתקשורת HTTP רגילה. את פיתוח צד הלקוח(ממשק המשתמש) נבצע בשפת JavaScript עם הטכנולוגיות: HTML ו CSS.
