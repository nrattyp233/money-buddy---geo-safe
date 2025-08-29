import React from "react";

const PrivacyPolicy: React.FC = () => (
  <div style={{ maxWidth: 700, margin: "40px auto", padding: "24px", background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
    <h1>Privacy Policy</h1>
    <p>
      <strong>Money Buddy</strong> is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information.
    </p>
    <h2>Information We Collect</h2>
    <ul>
      <li>Account information you provide when signing up.</li>
      <li>Financial data accessed securely via Plaid for account linking, balance, and transaction viewing.</li>
      <li>Usage data to improve app features and security.</li>
    </ul>
    <h2>How We Use Your Information</h2>
    <ul>
      <li>To provide core app features like viewing balances, sending/requesting money, and transaction history.</li>
      <li>To enhance security and user experience.</li>
      <li>We do <strong>not</strong> sell or share your data with third parties.</li>
    </ul>
    <h2>Data Security</h2>
    <p>
      We use industry-standard security measures to protect your data, including encryption and secure APIs.
    </p>
    <h2>Your Choices</h2>
    <ul>
      <li>You can disconnect your financial accounts at any time.</li>
      <li>Contact us for data deletion or privacy concerns.</li>
    </ul>
    <h2>Contact</h2>
    <p>
      For questions about this policy, email us at <a href="mailto:support@moneybuddy.com">support@moneybuddy.com</a>.
    </p>
  </div>
);

export default PrivacyPolicy;
