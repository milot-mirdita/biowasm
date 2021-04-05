#include <unistd.h>
extern "C" {
extern char **environ;
extern int execvpe_js(const char *arg0, char *const argv[], char** environ);
#define execvp(arg0, argv) execvpe_js((arg0), (argv), (environ))
}
