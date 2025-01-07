# AI Closet App Design Doc

## 1. Introduction

This design document outlines the implementation plan for the AI Closet Mobile App, a React Native application built with Expo to support both iOS and Android devices. The app aims to help users manage their clothes, create stylish outfits, and virtually try on clothes using AI-powered features like automatic clothing categorization, background removal, and virtual try-on capabilities.

Target Users:

- Fashion-conscious individuals and style enthusiasts interested in creating and sharing outfit ideas.
- Online shoppers who want to visualize clothing items before purchasing.

## 2. Features

1. Clothing Management:

   - Add, view, and categorize clothing items with AI assistance
   - Automatic background removal and clothing categorization
   - Custom tagging, attributes management and organization options

2. Outfit Management:

   - Create, save, and manage outfits using clothing items
   - Outfit collage creation, which provides user an empty canvas and user can drag-and-move different clothing items on the canvas to create outfits
   - Tagging and categorization of outfits

3. Virtual Try-On:
   - Allow users to virtually try on clothes using their photos
   - User can choose to try-on: individual items from the closet, or upload items from the user’s photo albums

## 3. High-Level Architecture

The application follows a modular architecture, separating concerns into distinct layers:

- UI Layer: Handles the presentation and user interaction, built with React Native components.
- State Management Layer: Manages global state using React Context API.
- Data Layer: Handles data storage and retrieval using AsyncStorage and expo-file-system for local data.
- Service Layer: Manages interactions with third-party APIs for AI functionalities.
- Navigation Layer: Manages screen transitions using React Navigation.

Component Interaction Flow:

- User Interaction: User interacts with UI components (e.g., adds a clothing item).
- State Update: UI components dispatch actions to update the global state via Context API.
- Data Persistence: Changes in state trigger updates to local storage.
- API Services: When AI features are needed, service calls are made to third-party APIs.
- UI Update: Responses from APIs update the state, which in turn updates the UI.

## 4. Implementation Details

### 4.1 UI/UX Design

Overall Layout:

- Tabs at the bottom of the screen for Clothing Management, Outfit Management, and Virtual Try-On

1. Clothing Management Screens:

   1.1 All Clothing Items Screen:

   Layout:

   - Top bar with "My Closet" title and a filter icon
   - Horizontal scrolling clothing item category tabs: All, Tops, Bottoms, Dresses, Outerwear
   - Tag section below categories, showing custom tags for quick filtering (e.g., Summer Favorites, Workwear)
   - Main content area with a grid layout of clothing item thumbnails (1:1 aspect ratio), 3 items per row
   - Bottom navigation bar with icons for Closet, Outfits, Try-On, and Profile

   Components:

   - Filter button in the top bar for sorting/filtering options
   - Category tabs for quick filtering
   - Tag chips for quick additional custom filtering
   - Clothing item thumbnails, showing the item on a neutral background
   - Add floating action button (yellow circle with "+" sign) in the bottom right corner
   - Navigation bar at the bottom

   Interactions:

   - Tapping category tabs filters the displayed items
   - Tapping tag chips applies additional filters
   - Tapping a clothing item thumbnail opens the item details screen
   - Tapping the add floating action button initiates the process of adding a new item:
     - The background dims, and 3 button options appear:
       - "Choose from Photos" button with gallery icon - tapping opens the device's photo gallery
       - "Camera" button with camera icon - tapping activates the device's camera for taking a new photo
       - "Cancel" button with an "x" icon - tapping dismisses the add item process
       - Post-tap actions:
         - If the user selects an image from the gallery or takes a photo, the background removal and AI categorization process starts, and the user is directed to the Clothing Item Detail Screen to review and edit the item attributes.
         - If the user cancels, the background returns to normal.
     - Animation: When the user taps the Add Button, the following happens simultaneously:
       - the background (clothing grid) becomes slightly dimmed to focus attention on the action options.
       - two additional buttons (for “Choose from Photos” and “Camera”) emerge from the original Add Button
       - the original Add Button transforms into a Cancel Button by rotating 45 degrees clockwise
   - Tapping navigation icons switches between main app sections
   
   1.2 Clothing Item Detail Screen:

   Layout:

   - Top bar with back arrow and delete icon
   - Large image of the clothing item (background removed)
   - Custom tags section below the image (e.g., Summer Favorites, Workwear)
   - "Relevant Outfits" section with horizontal scrolling thumbnails of outfits including the item
   - "Item Details" section with various attributes

   Components:

   - Back arrow for navigation
   - Delete icon (trash can) for removing the item
   - Main image (1:1 aspect ratio) of the clothing item with background removed
   - Tag chips (e.g., Summer Favorites, Workwear) with an add chip option
   - Horizontal scrolling outfit thumbnails (3:4 aspect ratio) showing the outfits that include the item
   - Attribute fields (Category(e.g., Tops/T-shirts), Color, Season, Occasion, Brand, Purchase Date, Price)
     - Each field is editable: tapping on it opens a dropdown or text input
   - Save button at the bottom (disabled until changes are made)

   Interactions:

   - Tapping the back arrow returns to the previous screen
   - Tapping the delete icon prompts a confirmation dialog for item removal
   - Tapping the add button next to tag chips allows adding new custom tags
   - Tapping outfit thumbnails opens the outfit details screen
   - Tapping attribute fields expands them for editing
   - Tapping the Save button commits changes

2. Outfit Management Screens:

   2.1 All Outfits Screen:

   Layout:

   - Top bar with "My Outfits" title and a filter icon
   - Tag section below the title, showing custom tags for quick filtering (outfit tags, not clothing item tags, e.g., Summer Looks, Date Night)
   - Main content area with a grid layout of outfit thumbnails (3:4 aspect ratio), 2 items per row
   - Bottom navigation bar with icons for Closet, Outfits, Try-On, and Profile

   Components:

   - Filter button in the top bar for sorting/filtering options
   - Tag chips for quick custom filtering
   - Outfit thumbnails showing the outfit collage
   - Add floating action button (yellow circle with "+" sign) in the bottom right corner
   - Navigation bar at the bottom

   Interactions:

   - Tapping tag chips applies quick filters based on tags
   - Tapping an outfit thumbnail opens the outfit details screen
   - Tapping the add floating action button opens the outfit canvas screen to create a new outfit
   - Tapping navigation icons switches between main app sections

   2.2 Outfit Canvas Screen:

   Layout:

   - Top bar with back arrow, "Outfit Canvas" title, and a save icon
   - Main canvas area displaying clothing items
   - Two yellow buttons at the bottom: "Add Items" and "Save Outfit"

   Components:

   - Back arrow for navigation to the previous screen
   - Canvas area where clothing items are displayed and can be arranged
   - Clothing items with manipulation controls (resize, rotate, delete)
   - "Add Items" button to open the clothing item selection screen to include more clothing pieces
   - "Save Outfit" button to finalize and save the current outfit

   Interactions:

   - Tapping the back arrow returns to the previous screen
   - Drag-and-drop, pinch-to-zoom, and rotate gestures for manipulating clothing items on the canvas
   - Using manipulation controls to adjust item size and orientation
   - Tapping "Add Items" pops up the "Outfit Canvas / Add Clothing Item" screen
   - Tapping "Save Outfit" saves the created outfit and likely opens the outfit detail screen

   2.3 Outfit Canvas / Add Clothing Item Component:

   Layout:

   - Overlay on top of the Outfit Canvas screen
   - A close button (X icon) on the top right corner of the overlay
   - The overlay component is similar to the "All Clothing Items" screen:
     - Top bar with "Choose Closet Items to Add"" Subtitle and a filter icon
     - Horizontal scrolling category tabs: All, Tops, Bottoms, Dresses, Outerwear
     - Tag section below categories, showing custom tags for quick filtering (e.g., Summer Favorites, Workwear)
     - Main content area with a grid layout of clothing item thumbnails (1:1 aspect ratio), 3 items per row

   Components:

   - Close button (X icon) to dismiss the overlay
   - Filter button in the top bar for sorting/filtering options
   - Category tabs for quick filtering
   - Tag chips for additional custom filtering
   - Clothing item thumbnails for selection

   Interactions:

   - Tapping the close button dismisses the overlay and returns to the Outfit Canvas
   - Tapping filter button opens sorting/filtering options
   - Tapping category tabs filters the displayed items
   - Tapping tag chips applies additional filters
   - Tapping a clothing item thumbnail adds it to the outfit canvas

   2.4 Add Outfit & Outfit Details Screen:

   Layout:

   - Top bar with back arrow and delete icon
   - Main image of the complete outfit
   - Custom tags section below the image
   - "Included Items" section with horizontal scrolling thumbnails of individual clothing items (1:1 aspect ratio) in the outfit
   - "Outfit Details" section with 2 attributes (Season, Occasion)

   Components:

   - Back arrow for navigation
   - Delete icon (trash can) for removing the outfit
   - Main image of the complete outfit (1:1 aspect ratio)
   - Tag chips (outfit tags, not clothing item tags) with an add chip option
   - Thumbnails of individual clothing items in the outfit
   - Attribute fields (Season, Occasion)
   - Save button at the bottom (disabled until changes are made)

   Interactions:

   - Tapping the back arrow returns to the previous screen (All Outfits, Outfit Canvas, Clothing Item Details)
   - Tapping the delete icon prompts a confirmation dialog for outfit removal
   - Tapping the add button next to tags allows adding new tag chips
   - Tapping individual item thumbnails could open the item details
   - Tapping attribute fields allows for editing
   - Tapping the Save button commits changes

3. Virtual Try-On Screens:

   3.1 Virtual Try-On Screen:

   Layout:

   - Top bar with "Virtual Try-On" title
   - Main View:
     - Instructional text below the title - "Select an outfit and upload your photo to see how it looks on you"
     - An expandable "Show Photo Tips" option with an information icon
     - Two main content areas side by side: "Choose Outfit" and "Add Your Picture"
     - "Try It On!" button (yellow) below the main content areas
     - "Recently Tried" section at the bottom with a grid of recent try-on results 2 items per row
     - Main View area is vertically scrollable
   - Bottom navigation bar with icons for Closet, Outfits, Try-On, and Profile

   Components:

   - Instructional text for guidance
   - Expandable information icon for photo tips
   - Selected outfit preview area (left side)
   - Selected user photo area (right side)
   - "Choose Outfit" and "Add Your Picture" buttons within their respective areas
   - "Try It On!" action button (disabled until both outfit and photo are selected)
   - Thumbnails of recently tried outfits/items
   - Navigation bar at the bottom

   Interactions:

   - Tapping the "Show Photo Tips" expands the section to show photo tips
   - Tapping "Choose Outfit" pops up the "Choose What to Try-On" bottom sheet
   - Tapping "Add Your Picture" opens the device's photo gallery for image selection
   - When both outfit and photo are selected, the "Try It On!" button becomes enabled
   - Tapping "Try It On!" initiates the virtual try-on process:
     - The "Try It On!" button changes to a "Try-on Rendering Progress" bar, everything else stays the same
     - The "Try-on Rendering Progress" component consists of a text label, a progress bar, and a percentage indicator:
       - The text "Try-on Rendering Progress" is displayed prominently at the top.
       - Below the text is a horizontal progress bar.
       - The percentage completion (xx%) is shown in the top-right corner.
     - Once the rendering is complete, the "Try-on Rendering Progress" bar disappears, and the try-on result image is displayed in the main view between the two main content areas for outfit and photo selection and the "Recently Tried" section (the original place of "Try It On!" button):
       - The try-on result image is displayed in a 3:4 aspect ratio.
       - Re-generate button is displayed below the try-on result image. If the user taps this button, the try-on process is reinitiated.
       - The thumbnail of the generated try-on image is added to the "Recently Tried" section.
       - If the user taps the choose outfit or add your picture buttons, the screen returns to the original state.
   - Tapping a recently tried thumbnail displays the full try-on image
   - Tapping navigation icons switches between main app sections

   3.2 Virtual Try-On / Choose What to Try-On Bottom Sheet:

   Layout:

   - Bottom sheet overlay on top of the Virtual Try-On screen
   - A close button (X icon) on the top right corner of the overlay
   - "Choose what to try on" title with instructions
   - Three options presented vertically: Single Closet Item, Discover & Try, Complete Outfits (Coming Soon)

   Components:

   - Close button (X icon) to dismiss the overlay
   - Icon and text for each try-on option (Single Closet Item, Discover & Try, Complete Outfits)
   - Brief description under each option (e.g., "Try a single item from your closet", "Try on new items from your photo albums or product images from online stores", "Try on your saved outfit with multiple pieces")

   Interactions:

   - Tapping the close button dismisses the overlay and returns to the Virtual Try-On screen
   - Selecting "Single Closet Item" opens the Add Clothing Item Component overlay (similar to the Outfit Canvas / Add Clothing Item screen)
   - Selecting "Discover & Try" opens the device's photo gallery for image selection
   - "Complete Outfits" is marked as "Coming Soon" and is not interactive yet

   3.3 Virtual Try-On / Choose What to Try-On / Choose Closet Item Screen:

   - This is the same component as the "Outfit Canvas / Add Clothing Item" screen but with a different title and purpose
   - The layout and components are the same as the "Outfit Canvas / Add Clothing Item" screen
   - The title is "Choose Closet Items to Try On" instead of "Choose Closet Items to Add"

### 4.2 Data Management

- AsyncStorage: Used for storing structured data like JSON representations of ClothingItems, Outfits, and TryOnSessions.
- expo-file-system: Used for storing image files locally on the device.

Data Persistence Strategy:

- When a new item is added or updated, the corresponding data model is serialized to JSON and stored in AsyncStorage.
- Image files are stored using expo-file-system, and their URIs are referenced in the data models.
- Data retrieval is handled asynchronously, loading from AsyncStorage and file system upon app launch or when needed.

#### 4.2.1 Data Models

1. Clothing Item Model:

   - id: string (uuid)
   - imageUri: string
   - backgroundRemovedImageUri: string
   - createdAt: string
   - updatedAt: string
   - category: string (Tops, Bottoms, Dresses, Outerwear)
   - subcategory: string (e.g., T-shirts, Jeans, Skirts, Jackets)
   - tags: string[] (custom tags, e.g., Summer Favorites, Workwear)
   - color: string[]
   - season: string[] (Spring/Fall, Summer, Winter)
   - occasion: string[] (Casual, Work, Formal, Party, Sports)
   - brand: string
   - purchaseDate: string (formatted date)
   - price: number

2. Outfit Model:

   - id: string (uuid)
   - imageUri: string
   - createdAt: string
   - updatedAt: string
   - clothingItems: string[] (references to included clothing item ids)
   - tags: string[] (custom tags, e.g., Summer Looks, Date Night)
   - season: string[] (Spring, Summer, Fall, Winter)
   - occasion: string[] (Casual, Work, Formal, Party)

3. Virtual Try-On Model:
   - id: string (uuid)
   - createdAt: string
   - updatedAt: string
   - tryOnType: string (Single Closet Item, Discover & Try, Complete Outfits)
   - clothingItemId: string (reference to the selected clothing item id)
   - outfitId: string (reference to the selected outfit id)
   - newClothingImageUri: string (user-uploaded photo for try-on, for Discover & Try option)
   - userPhotoUri: string
   - resultImageUri: string

#### 4.2.2 State Management

- Use React Context and hooks (if applicable) for global state management to avoid prop drilling and provide state access across the app.

- Contexts:

  - ClothingContext: Manages clothing items.
  - OutfitContext: Manages outfits.
  - TryOnContext: Manages try-on sessions.

- Actions:
  - Add, Update, Delete operations for each data model.
  - Load Initial Data: Fetch data from AsyncStorage on app startup.

### 4.3 Additional Implementation Details

1. Centralize colors and common styles in `/src/styles` for consistent theming

2. Break down UI elements into reusable components

3. Implement navigation using React Navigation for seamless transitions between screens

4. Use Expo Camera and ImagePicker APIs for capturing photos and selecting images
