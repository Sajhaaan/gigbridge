import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4f46e5",
  },
  navButtons: {
    flexDirection: "row",
    gap: 16,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#4f46e5",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  hero: {
    padding: 20,
    backgroundColor: "#f8fafc",
  },
  heroContent: {
    alignItems: "center",
    gap: 16,
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1e293b",
  },
  heroSubtitle: {
    fontSize: 20,
    textAlign: "center",
    color: "#64748b",
    maxWidth: 600,
  },
  ctaButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: "#4f46e5",
  },
  ctaButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  features: {
    padding: 20,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
    justifyContent: "center",
  },
  featureCard: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureIcon: {
    width: 48,
    height: 48,
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
    color: "#1e293b",
  },
  featureDescription: {
    fontSize: 16,
    color: "#64748b",
    lineHeight: 24,
  },
  footer: {
    padding: 20,
    backgroundColor: "#1e293b",
  },
  footerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    color: "#fff",
    fontSize: 14,
  },
});

export default function Home() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.logo}>GigBridge</Text>
          <View style={styles.navButtons}>
            <Link href="/auth/signin" asChild>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Sign In</Text>
              </TouchableOpacity>
            </Link>
            <Link href="/auth/signup" asChild>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>

      <View style={styles.hero}>
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>Find Your Next Gig</Text>
          <Text style={styles.heroSubtitle}>
            Connect with businesses and workers in your area. Post jobs, apply for positions, and grow your career.
          </Text>
          <Link href="/auth/signup" asChild>
            <TouchableOpacity style={styles.ctaButton}>
              <Text style={styles.ctaButtonText}>Get Started</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      <View style={styles.features}>
        <View style={styles.featuresGrid}>
          <View style={styles.featureCard}>
            <Ionicons name="search" size={48} color="#4f46e5" />
            <Text style={styles.featureTitle}>Find Jobs</Text>
            <Text style={styles.featureDescription}>
              Browse through thousands of job opportunities from top companies in your area.
            </Text>
          </View>
          <View style={styles.featureCard}>
            <Ionicons name="briefcase" size={48} color="#4f46e5" />
            <Text style={styles.featureTitle}>Post Jobs</Text>
            <Text style={styles.featureDescription}>
              Reach qualified candidates and find the perfect match for your business needs.
            </Text>
          </View>
          <View style={styles.featureCard}>
            <Ionicons name="chatbubbles" size={48} color="#4f46e5" />
            <Text style={styles.featureTitle}>Connect</Text>
            <Text style={styles.featureDescription}>
              Communicate directly with employers and candidates through our platform.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <Text style={styles.footerText}>© 2024 GigBridge. All rights reserved.</Text>
        </View>
      </View>
    </ScrollView>
  );
}