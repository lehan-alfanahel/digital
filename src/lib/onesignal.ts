"use client";

interface OneSignalConfig {
  appId: string;
  allowLocalhostAsSecureOrigin?:
  autoRegister?: boolean;
  autoResubscribe?: boolean;
  path?: string;
  serviceWorkerPath?: string;
  service
  serviceWorkerParam?: { scope: string };
  subdomainName?: string;
  promptOptions?: {
    slidedown?: {
      prompts: Array<{
        type
        autoPrompt:
        text: {
          actionMessage: string;
          acceptButton: string;
          cancelButton: string;
        };
        delay: {
          page
          time
        };
      }>;
    };
  };
  welcomeNotification?: {
    disable?: boolean;
    title?: string;
    message?: string;
    url?: string;
  };
  notifyButton?: {
    enable?: boolean;
    displayPredicate?: () => boolean;
    size?: string;
    position?: string;
    showCredit?: boolean;
    colors?: {
      'circle.background': string;
      'circle.foreground': string;
      'badge.background': string;
      '
      'badge.bordercolor': string;
      'pulse.color': string;
      'dialog.button.background.hovering': string;
      'dialog.button.background.active': string
      'dialog.button.background': string;
      'dialog.button.foreground': string;
    };
  };
}

class OneSignalService {
  private initialize
  private OneSignal: any = null;

  async initialize(): Promise<void>
    if (this.initialize

    try {
      // Dynamic import to avoid SSR issues
      const OneSignalModule = await import('react-onesignal');
      this.

      const config: OneSignalConfig = {
        appId: "c8ac779e-241b-4903-8ed4-6766936a4fee",
        allowLocalhostAsSecureOrigin: true,
        autoRegister
        autoResubscribe: true,
        serviceWorkerPath: '/OneSignalSDKWorker.js',
        serviceWorkerUpdaterPath: '/OneSignalSDKUpdaterWorker.js',
        path: '/onesignal/',
        promptOptions: {
          slidedown:
            prompts: [
              {
                type: "push",
                autoPrompt: true,
                text: {
                  actionMessage: "Terima notifikasi dari Ab
                  acceptButton: "Izinkan",
                  cancelButton: "Tidak"
                },
                delay: {
                  pageViews: 1,
                  timeDelay: 3
                }
              }
            ]
          }
        },
        welcomeNotification: {
          disable: false,
          title: "Se
          message: "Ter
        },
        notifyButton: {
          enable: true,
          displayPredicate: () => true,
          size: "medium",
          position: "bottom-right",
          showCredit: false
          colors: {
            'circle.backgroun
            'circle.foreground': 'white',
            'badge.background': '#FF4444',
            'badge.foreground': 'white
            'badge.bordercolor': 'white',
            'pulse.color': 'white',
            'dialog.button.background.hovering':
            '
            'dialog.button.background': '#4C6FFF
            'dialog.button.foreground':
          }
        }
      };

      await this.OneSignal.init(config);
      this.initialized =

      // Event listeners
      this.OneSignal.on('subscriptionChange', (isSubscribed:
        console.log('OneSignal subscription changed:', isSubscribed);
        this.handleSubscriptionChange(isSubscribed);
      });

      this.OneSignal.on('notificationPermissionChange', (permission: string) => {
        console.log('OneSignal permission changed:', permission);
      });

      this.OneSignal.on('notificationDisplay', (event
        console.log('OneSignal notification displayed:', event);
        this.updateB
      });

      this.OneSignal.on('notificationClick', (event: any) => {
        console.log('OneSignal notification clicked:', event);
        this.handleNotificationClick(event);
      });

      console.log('OneSignal initialized successfully');
    } catch (error) {
      console.error('OneSignal initialization failed:', error);
    }
  }

  private
    if (isSubscribed) {
      const
      console.log('User subscribed with Player ID:', playerId);
    }
  }

  private handleNotificationClick(event: any) {
    if (event.data && event.data.url) {
      window.location.href = event
    }
  }

  private async update
    try {
      if ('navigator' in window && 'set
        const
        (navigator as any).setAppBadge(currentCount);
      }
    } catch
      console.error('Error updating badge:', error);
    }
  }

  private async getUnreadCount(): Promise<number> {
    const
    return stored ? parseInt(stored) : 0;
  }

  async getPlayerId():
    if (!this.OneSignal) return null;
    try {
      return
    } catch (error) {
      console.error('Error getting OneSignal player ID
      return null;
    }
  }

  async isSubscribed(): Promise<boolean> {
    if (!this.OneSignal) return false
    try {
      return
    } catch (error) {
      console.error('Error checking OneSign
      return
    }
  }

  async requestPermission(): Promise<void> {
    if (!this.OneSignal)
    try {
      await this.OneSignal.registerForPushNotifications();
    } catch (error) {
      console.error('
    }
  }

  async sendTag(key: string, value: string
    if (!this.OneSignal) return;
    try {
      await this.One
    } catch (error) {
      console.error('Error sending OneSignal tag:', error);
    }
  }

  async sendTags(tags: Record<string, string>): Promise<void> {
    if (!this.OneSignal) return;
    try {
      await this.OneSignal
    } catch (error) {
      console.error('Error sending OneSignal tags:', error);
    }
  }

  async delete
    if (!this.OneSignal) return;
    try {
      await this.OneSignal.
    } catch (error) {
      console.error('Error deleting OneSignal tag:', error);
    }
  }

  async getT
    if (!this.OneSignal) return null;
    try
      return await this.OneSignal.getTags();
    } catch (error) {
      console.error('Error getting OneSign
      return
    }
  }

  async sendTestNotification(message: string): Promise<void> {
    try
      const playerId = await
      if (!playerId) {
        console.error('No player ID available');
        return;
      }

      const notificationData = {
        app
        include_player_ids
        headings: { "en": "Absensi Digital", "id": "Absensi Digital" },
        contents: { "en": message, "id": message },
        data: { url: window.location.origin },
        web
          {
            id: "open-app",
            text: "Buka Aplikasi",
            url: window
          }
        ]
      };

      console.log('Notification
    } catch (error) {
      console.error('Error preparing test notification:', error
    }
  }
}

export const oneSignalService = new OneSignalService();