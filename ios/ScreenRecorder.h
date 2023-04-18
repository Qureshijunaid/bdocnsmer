//
//  ScreenRecorder.h
//  BANDO_CONSUMER
//
//  Created by Admin on 08/08/22.
//


#import "React/RCTBridgeModule.h"

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

extern NSString *kScreenRecordingDetectorRecordingStatusChangedNotification;

@interface ScreenRecordingDetector : NSObject

+(instancetype)sharedInstance;
+ (void)triggerDetectorTimer;
+ (void)stopDetectorTimer;
- (BOOL)isRecording;

@end

@interface ScreenRecorderDetect : NSObject <RCTBridgeModule>
@end
