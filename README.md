<h2 align="center">
AI Closet
</h2>

> <div align="center">
>   <sub>Thank you for checking out AI Closet! If you find it useful or interesting, consider giving this repository a <strong>star</strong> ⭐. It helps others discover the project too.</sub>
> </div>

<div align="center">
  <img src="release_assets/banner.png" alt="Hero Image Banner" width="100%" /> 
</div>


**AI Closet** is a mobile application that brings an AI-powered approach to closet management and styling. Whether you want to keep track of every piece in your closet, or seek an easy way to visualize outfit ideas, the AI Closet helps you:

- Digitally store and manage all your clothing.  
- Experiment with outfit combinations on a freeform canvas and save your favorite looks for future inspiration.  
- Preview how items/outfits (even from online stores) might look on you using virtual try-on technology.

The app is built with **React Native** and **Expo**, offering a cross-platform solution for both iOS and Android. By integrating AI for tasks like automatic background removal and smart categorization, it reduces manual work and helps users stay organized and creative with their wardrobe.


---

### Key Features

<table max-height="400px">
  <tr>
    <td width="33%">
      <strong>Add &amp; Manage Clothing Items</strong><br />
      <ul>
        <li>Easily add clothing items from the camera or gallery.</li>
        <li>AI automatically removes backgrounds and assigns attributes (e.g., category, color, season).</li>
      </ul>
    </td>
    <td width="33%" align="center">
      <img src="release_assets/all_clothes.png" alt="All Clothing Items screen" style="max-width:100%; max-height:400px;">
    </td>
    <td width="33%" align="center">
      <img src="release_assets/clothes_detail.png" alt="Clothing Item Details screen" style="max-width:100%; max-height:400px;">
    </td>
  </tr>
</table>

<br />

<table max-height="400px">
  <tr>
    <td width="33%">
      <strong>Create &amp; Save Outfits</strong><br />
      <ul>
        <li>Mix and match items on a freeform canvas, drag-and-drop to arrange the perfect look.</li>
        <li>Store finished outfits and revisit them anytime to make updates or get inspiration.</li>
        <li>Each clothing item lists the outfits it belongs to.</li>
      </ul>
    </td>
    <td width="33%" align="center">
      <img src="release_assets/all_outfits.png" alt="All Outfits screen" style="max-width:100%; max-height:400px;">
    </td>
    <td width="33%" align="center">
      <img src="release_assets/outfit_canvas.png" alt="Outfit Canvas screen" style="max-width:100%; max-height:400px;">
    </td>
  </tr>
</table>

<br />

<table max-height="400px">
  <tr>
    <td width="60%">
      <strong>Virtual Try-On</strong><br />
      <ul>
        <li>Upload a personal photo and let the AI generate an approximate look.</li>
        <li>Keep track of previous try-on sessions to revisit or share later.</li>
      </ul>
    </td>
    <td width="40%" align="center">
      <img src="release_assets/vton.png" alt="Virtual Try-On screen" style="max-width:100%; max-height:400px;">
    </td>
  </tr>
</table>


---

### Tech Stack

<div>
  <ul>
    <li><strong>TypeScript:</strong> Primary language for safer code and better autocompletion.</li>
    <li><strong>React Native &amp; Expo:</strong> Cross-platform mobile development for iOS &amp; Android.</li>
    <li><strong>AsyncStorage &amp; expo-file-system:</strong> Local data persistence and file handling.</li>
    <li><strong>AWS Services (Planned):</strong> API Gateway, Lambda, DynamoDB, S3 for future cloud integration.</li>
  </ul>
</div>

---

### Installation and Usage

1. **Clone the Repository:**
   ```shell
   git clone [Your Repo URL Here]
   cd [Your Repo Name]
   ```

2. **Install Dependencies:**
   ```shell
   npm install
   ```

3. **Configure Environment:**  
   - The AI features require require the following APIs and keys, add them to your environment variables:
   - OpenAI API: for auto categorization and tagging
   - FalAI AI: for background removal
   - Kwai: for virtual try-on
   ```shell
   EXPO_PUBLIC_OPENAI_KEY = ""
   EXPO_PUBLIC_FAL_KEY = ""
   EXPO_PUBLIC_KWAI_ACCESS_KEY = ""
   EXPO_PUBLIC_KWAI_SECRET_KEY = ""
   ```

4. **Run the App:**
   ```shell
   npm start
   # Use the Expo CLI to run on an emulator, simulator, or physical device
   ```

The app should now be running on your local machine. You can access it via the Expo client on your mobile device or an emulator.

---

### Architecture and Future Roadmap

<div align="center">
  <img src="release_assets/system_arch.png" alt="System Architecture Diagram" width="80%" />
  <p><em>Architecture Diagram (including both client and future cloud components)</em></p>
</div>

#### Current Implementation (Client-Side)
1. **UI Layer** – Built with React Native to support iOS and Android.  
2. **State Management Layer** – Powered by React Context API for global state.  
3. **Data Layer** – Uses AsyncStorage and <code>expo-file-system</code> for metadata and image storage.

#### Planned Cloud Components
1. **API Gateway** – Securely proxy API requests while hiding and protecting sensitive API keys.  
2. **Rate Limiting System** – AWS Lambda checks user credits before forwarding API requests; logs transactions in DynamoDB.  
3. **AI Services** – Current third-party AI services will move behind a proxy to enforce rate limits and protect API keys.

> **Note:** Currently only the client-side components are implemented. Third-party AI services reside in the client codebase. Cloud features and the credit-based system are in the planning stage.

Refer to the [design_doc](/design_doc.md) for more details on the current architecture.

### Future Features
- **Batch Clothing Upload**: Add multiple clothing items at once for faster initial closet setup.
- **Social Sharing & Export**: Easily share outfits to social media or with friends.
- **User Onboarding Screens**: Introduce new users to the app and its features.
- **Outfit Calendar**: Track daily outfits and look back at past styles.
- **Closet Analytics**: Gather insights like items per category, color distribution, etc.
- **Multi-item Try-On Options**: Support multi-item try-on such as full outfits or multiple items at once.
- **Credit-Based Premium Features**: Implement a system that allows users to purchase credits for expensive AI functionalities (mainly virtual try-ons or large-scale operations).

---

### Productization Considerations

<div>
  <p>One key differentiator of AI Closet is the <strong>integrated virtual try-on plus wardrobe management</strong> — an all-in-one approach compared to many closet-only or try-on-only apps.</p>
</div>

#### Cost Estimation

| Service                                 | Cost/Usage      |
|-----------------------------------------|-----------------|
| **Background Removal (Birefnet)**       | \$0.002/image   |
| **Clothing Categorization (GPT-4o)**    | \$0.002/image   |
| **Virtual Try-On (Kolors by Kwai)**     | \$0.1/try-on    |

Assuming an average user uploads 50 images per month, the estimated monthly cost per user would be around $0.20 for simple usage (not counting try-ons). However, for users who want to use the virtual try-on feature more frequently, a credit-based system can be implemented. 

Example: 50 credits for \$10; each try-on = 1 credit.

This system would provide a revenue stream while keeping the app free for most users.

The backend AWS cost is minimal, but are crucial for implementing secure credit-based or pay-as-you-go models in the future. This is included for reference:

**Backend AWS Costs** (for future cloud integrations):  
- **API Gateway**: \$3.50 for first 333M requests  
- **AWS Lambda**: \$0.20 per million requests  
- **DynamoDB**: \$0.7 per million writes, \$0.2 per million reads  

---

### Contributing

Contributions are appreciated! Whether it’s a bug fix, new feature proposal, or performance optimization. For major changes, please open an issue first to discuss what you’d like to change. This ensures alignment and helps us provide guidance.

---

### License

This project is licensed under the **MIT License**.

---

### Contact & Support

- **Issues / Bug Reports**: Please use the [GitHub Issues](#) tab for bugs or feature requests.  
- **Questions / Suggestions**: Feel free to start a discussion in the [Discussions](#) tab.

<br />
<div align="center">
  <sub>Thank you for reading! If you find AI Closet useful, consider giving this repository a <strong>star</strong> ⭐.</sub>
</div>
